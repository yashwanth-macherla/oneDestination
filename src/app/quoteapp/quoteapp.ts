import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuoteCategory, QuoteService } from './quote.service';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-quoteapp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quoteapp.html',
  styleUrl: './quoteapp.css',
})
export class Quoteapp {
  categories: QuoteCategory[] = ['motivation', 'inspiration', 'comedy', 'funny'];
  selectedCategory: QuoteCategory = 'motivation';
  topic: string = '';
  quote: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private quoteService: QuoteService,
              private cdr: ChangeDetectorRef

  ) {}

  async generateQuote() {
    if (this.isLoading) return;

    this.error = null;
    this.quote = null;
    this.isLoading = true;
    this.cdr.detectChanges();

    try {
      this.quote = await this.quoteService.generateQuote(this.selectedCategory, this.topic.trim() || undefined);
    } catch (err: any) {
      console.error(err);
      this.error = err?.message || 'Something went wrong while generating your quote. Please try again.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  get topicForDisplay(): string | null {
    const trimmed = this.topic.trim();
    return trimmed.length ? trimmed : null;
  }

}
