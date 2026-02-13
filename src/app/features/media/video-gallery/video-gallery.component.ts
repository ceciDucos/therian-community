
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../core/services/video.service';
import { I18nService } from '../../../core/services/i18n.service';
import { EmbeddedVideo } from '../../../models/misc.model';
import { SafePipe } from '../../../shared/pipes/safe.pipe';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [CommonModule, SafePipe, CardComponent, TranslatePipe],
  template: `
    <div class="container mx-auto py-8 px-4">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">{{ 'media.title' | translate }} 🎬</h1>
          <p class="text-muted-foreground mt-2">{{ 'media.subtitle' | translate }}</p>
        </div>
      </div>

      <div *ngIf="loading()" class="py-12 text-center text-muted-foreground">
        {{ 'media.loading' | translate }}
      </div>

      <div *ngIf="!loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-card *ngFor="let video of videos()" class="overflow-hidden h-full flex flex-col">
          <!-- Video Embed -->
          <div class="aspect-video w-full bg-black">
            <iframe 
              [src]="video.embed_url | safe:'resourceUrl'" 
              class="w-full h-full" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
          
          <div class="p-4 flex-1 flex flex-col">
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground uppercase">
                {{ video.platform }}
              </span>
              <span class="text-xs text-muted-foreground">{{ video.created_at | date }}</span>
            </div>
            
            <h3 class="font-semibold text-lg mb-2 line-clamp-2">{{ video.title }}</h3>
            
            <p class="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
              {{ video.description }}
            </p>
            
            <div class="mt-auto pt-2 flex justify-end">
               <a *ngIf="video.video_id && video.platform === 'youtube'" 
                  [href]="'https://www.youtube.com/watch?v=' + video.video_id" 
                  target="_blank" 
                  class="text-xs text-primary hover:underline flex items-center gap-1">
                  {{ 'media.watchOnYoutube' | translate }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
               </a>
            </div>
          </div>
        </app-card>
      </div>

      <div *ngIf="!loading() && videos().length === 0" class="text-center py-12 text-muted-foreground">
        {{ 'media.empty' | translate }}
      </div>
    </div>
  `,
  styles: []
})
export class VideoGalleryComponent implements OnInit {
  private videoService = inject(VideoService);
  i18n = inject(I18nService);

  videos = signal<EmbeddedVideo[]>([]);
  loading = signal(true);

  async ngOnInit() {
    await this.loadVideos();
  }

  async loadVideos() {
    this.loading.set(true);
    const { data } = await this.videoService.getVideos();
    if (data) {
      this.videos.set(data);
    }
    this.loading.set(false);
  }
}
