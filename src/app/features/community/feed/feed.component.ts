
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { Post } from '../../../models/post.model';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PostCardComponent, ButtonComponent, CardComponent],
  template: `
    <div class="container max-w-2xl py-6 mx-auto">
      <!-- Create Post -->
      <app-card class="mb-8 p-4">
        <form [formGroup]="postForm" (ngSubmit)="createPost()">
          <div class="flex gap-4">
            <div class="w-10 h-10 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center font-bold text-secondary-foreground">
              {{ (authService.user()?.user_metadata?.['username']?.charAt(0) || 'U') | uppercase }}
            </div>
            <div class="flex-1 space-y-3">
              <textarea 
                formControlName="content"
                placeholder="¿Qué está pasando en tu territorio?"
                class="w-full min-h-[80px] bg-transparent resize-none border-b focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
              ></textarea>
              
              <div class="flex justify-between items-center">
                <div class="flex gap-2">
                   <!-- Image Upload Trigger Placeholder -->
                   <button type="button" class="text-muted-foreground hover:text-primary p-2 rounded-full hover:bg-accent transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                   </button>
                </div>
                <app-button 
                  type="submit" 
                  variant="primary" 
                  size="sm" 
                  [disabled]="postForm.invalid || isPosting()"
                >
                  {{ isPosting() ? 'Publicando...' : 'Aullar' }}
                </app-button>
              </div>
            </div>
          </div>
        </form>
      </app-card>

      <!-- Feed -->
      <div class="space-y-6">
        <div *ngIf="loading()" class="text-center py-12 text-muted-foreground">
          Cargando aullidos...
        </div>

        <app-post-card 
          *ngFor="let post of posts()" 
          [post]="post"
          (like)="onLike($event)"
        ></app-post-card>

        <div *ngIf="!loading() && posts().length === 0" class="text-center py-12 text-muted-foreground">
          No hay publicaciones aún. ¡Sé el primero en aullar!
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FeedComponent implements OnInit {
  private postService = inject(PostService);
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  posts = signal<Post[]>([]);
  loading = signal(true);
  isPosting = signal(false);

  postForm = this.fb.group({
    content: ['', [Validators.required, Validators.minLength(1)]]
  });

  async ngOnInit() {
    await this.loadPosts();
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

    // TODO: Handle image upload
    const { error } = await this.postService.createPost(content);

    if (!error) {
      this.postForm.reset();
      await this.loadPosts(); // Refresh feed
    }

    this.isPosting.set(false);
  }

  async onLike(postId: string) {
    const { error } = await this.postService.toggleLike(postId);
    if (error) {
      console.error('Error liking post:', error);
      // Revert optimistic update if needed (requires managing state carefully)
      // Since PostCard does optimistic update, we might want to reload or define correct behavior.
      // For now, simple error logging.
    }
  }
}
