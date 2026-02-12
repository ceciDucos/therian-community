
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '../../../models/post.model';
import { CardComponent } from '../../components/card/card.component';
import { ButtonComponent } from '../../components/button/button.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent],
  template: `
    <app-card class="mb-4">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-secondary overflow-hidden flex items-center justify-center">
             <img *ngIf="post.author?.avatar_url" [src]="post.author?.avatar_url" class="w-full h-full object-cover">
             <span *ngIf="!post.author?.avatar_url" class="font-bold text-secondary-foreground">{{ (post.author?.username?.charAt(0) || '?') | uppercase }}</span>
          </div>
          <div>
            <div class="font-semibold hover:underline cursor-pointer" [routerLink]="['/u', post.author?.username]">
              {{ post.author?.display_name || post.author?.username }}
            </div>
            <div class="text-xs text-muted-foreground">
              @{{ post.author?.username }} • {{ post.created_at | date:'short' }}
            </div>
          </div>
        </div>
        <!-- Options Menu (Placeholder) -->
      </div>

      <div class="space-y-4">
        <p class="whitespace-pre-wrap">{{ post.content }}</p>
        
        <div *ngIf="post.image_url" class="rounded-lg overflow-hidden border">
          <img [src]="post.image_url" class="w-full h-auto max-h-[500px] object-cover" loading="lazy">
        </div>
      </div>

      <div class="flex items-center gap-4 mt-6 pt-4 border-t">
        <button 
          (click)="onLike()" 
          class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          [class.text-primary]="isLiked"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart" [class.fill-current]="isLiked"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          {{ post.likes_count }}
        </button>
        
        <button class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
          {{ post.comments_count }}
        </button>
      </div>
    </app-card>
  `,
  styles: []
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Output() like = new EventEmitter<string>();

  isLiked = false; // TODO: Check if current user liked this post (requires joining likes table on user_id)

  onLike() {
    this.like.emit(this.post.id);
    // Optimistic update
    if (this.isLiked) {
      this.isLiked = false;
      this.post.likes_count--;
    } else {
      this.isLiked = true;
      this.post.likes_count++;
    }
  }
}
