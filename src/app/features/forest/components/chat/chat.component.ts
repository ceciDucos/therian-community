import { Component, inject, OnInit, ViewChild, ElementRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  private socketService = inject(SocketService);

  // Chat state
  messages = signal<{ id: string, username: string, text: string, color?: string }[]>([]);
  isOpen = signal(false); // TODO: Add logic to toggle chat visibility if needed, or default to true

  @ViewChild('chatInput') chatInput!: ElementRef<HTMLTextAreaElement>;

  constructor() {
    this.socketService.messages$
      .pipe(takeUntilDestroyed())
      .subscribe(msg => {
        this.messages.update(msgs => [...msgs, {
          id: msg.id,
          username: msg.username,
          text: msg.message,
          color: this.getUsernameColor(msg.username) // Generate a consistent color
        }]);

        // Auto-scroll to bottom (setTimeout to allow render)
        setTimeout(() => this.scrollToBottom(), 50);
      });
  }

  ngOnInit() {
  }

  sendMessage(text: string) {
    if (!text.trim()) return;

    this.socketService.sendMessage(text);
    // Don't modify local messages directly, wait for server echo which usually happens in MMOs, 
    // BUT checking SocketService, it seems it listens to 'chatMessage', so we assume server broadcasts it back.
    // If server doesn't echo back to sender, we might need to add it manually here.
    // For now assume standard socket.io broadcast including sender (or strict mvp)
  }

  toggleChat() {
    this.isOpen.update(v => !v);
  }

  private scrollToBottom() {
    const container = document.querySelector('.chat__messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  private getUsernameColor(username: string): string {
    // Simple hash for color
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }
}
