
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { Post } from '../../../models/post.model';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PostCardComponent, ButtonComponent, CardComponent, TranslatePipe],
  templateUrl: './feed.component.html',
  styles: []
})
export class FeedComponent implements OnInit {
  authService = inject(AuthService);
  private postService = inject(PostService);
  private profileService = inject(ProfileService);
  i18n = inject(I18nService);
  private fb = inject(FormBuilder);

  posts = signal<Post[]>([]);
  currentUserProfile = signal<Profile | null>(null);
  loading = signal(true);
  isPosting = signal(false);

  postForm = this.fb.group({
    content: ['', [Validators.required, Validators.minLength(1)]]
  });

  async ngOnInit() {
    this.loadPosts();
    const user = this.authService.user();
    if (user) {
      const { data } = await this.profileService.getProfile(user.id);
      if (data) {
        this.currentUserProfile.set(data);
      }
    }
  }

  async loadPosts() {
    this.loading.set(true);
    const { data, error } = await this.postService.getPosts();
    if (data) {
      this.posts.set(data);
    }
    this.loading.set(false);
  }

  async createPost() {
    if (this.postForm.invalid) return;

    this.isPosting.set(true);
    const content = this.postForm.value.content!;

    const { error } = await this.postService.createPost(content);

    if (!error) {
      this.postForm.reset();
      await this.loadPosts();
    }

    this.isPosting.set(false);
  }

  async onLike(postId: string) {
    const { error } = await this.postService.toggleLike(postId);
    if (error) {
      console.error('Error liking post:', error);
    }
  }
}
