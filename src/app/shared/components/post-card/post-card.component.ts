
import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '../../../models/post.model';
import { CardComponent } from '../../components/card/card.component';
import { ButtonComponent } from '../../components/button/button.component';
import { CommentSectionComponent } from '../../components/comment-section/comment-section.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, CommentSectionComponent],
  templateUrl: './post-card.component.html',
  styles: []
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Output() like = new EventEmitter<string>();

  showComments = signal(false);
  isLiked = false;

  toggleComments() {
    this.showComments.update(v => !v);
  }

  onLike() {
    this.like.emit(this.post.id);
    if (this.isLiked) {
      this.isLiked = false;
      this.post.likes_count--;
    } else {
      this.isLiked = true;
      this.post.likes_count++;
    }
  }
}


