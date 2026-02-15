
import { Component, Input, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { Comment } from '../../../models/post.model';
import { ButtonComponent } from '../button/button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, TranslatePipe],
  templateUrl: './comment-section.component.html',
  styles: []
})
export class CommentSectionComponent implements OnInit {
  @Input({ required: true }) postId!: string;

  private postService = inject(PostService);
  authService = inject(AuthService);
  i18n = inject(I18nService);

  comments = signal<Comment[]>([]);
  loading = signal(true);
  newComment = '';

  async ngOnInit() {
    await this.loadComments();
  }

  async loadComments() {
    this.loading.set(true);
    const { data } = await this.postService.getComments(this.postId);
    if (data) this.comments.set(data as Comment[]);
    this.loading.set(false);
  }

  async submitComment() {
    if (!this.newComment.trim()) return;
    const { error } = await this.postService.createComment(this.postId, this.newComment);
    if (!error) {
      this.newComment = '';
      await this.loadComments();
    }
  }

  async deleteComment(commentId: string) {
    await this.postService.deleteComment(commentId);
    await this.loadComments();
  }
}
