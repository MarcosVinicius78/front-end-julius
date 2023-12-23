import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator-component.component.html',
  styleUrls: ['./paginator-component.component.css']
})
export class PaginatorComponentComponent implements OnInit{


  @Input() currentPage!: number;
  @Input() totalPages!: number;

  @Output() pageChange = new EventEmitter<number>();

  ngOnInit(): void {
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  firstPage() {
    if (this.currentPage !== 1) {
      this.pageChange.emit(1);
    }
  }

  lastPage() {
    if (this.currentPage !== this.totalPages) {
      this.pageChange.emit(this.totalPages);
    }
  }

}
