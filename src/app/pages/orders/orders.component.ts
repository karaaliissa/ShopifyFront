import { Component } from '@angular/core';
import { ShopifyService } from '../../services/shopify.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  orders: any[] = [];
  nextPageInfo: any | null = null;
  loading = false;
  totalOrderCount = 0;
  tagOptions = ['Pending', 'Processing', 'Shipped', 'Completed', 'Canceled'];
  tagStats: Record<string, number> = {};
  showHistoryOnly = false;
  
  constructor(private shopifyService: ShopifyService) { }

  ngOnInit(): void {
    this.loadOrders();
    this.fetchTotalOrderCount(); // ✅
    this.fetchTagCounts();

  }
  fetchTagCounts(): void {
    this.shopifyService.getTagCounts().subscribe((res) => {
      this.tagStats = res.countsByTag;
      this.totalOrderCount = res.total;
    });
  }
  
  loadOrders(): void {
    this.loading = true;
    this.shopifyService.getOrders(this.nextPageInfo).subscribe((res: any) => {
      this.orders = [
        ...this.orders,
        ...res.orders.map((order: any) => ({
          ...order,
          selectedTag: this.tagOptions.find(opt =>
            (order.tags || '').toLowerCase().includes(opt.toLowerCase())
          ) || 'Pending'
        }))
      ];
      this.nextPageInfo = res.nextPageInfo || null;
      this.loading = false;
    });
  }


get filteredOrders(): any[] {
  if (this.showHistoryOnly) {
    return this.orders.filter(o =>
      ['Completed', 'Canceled'].includes(o.selectedTag)
    );
  }
  return this.orders.filter(o =>
    !['Completed', 'Canceled'].includes(o.selectedTag)
  );
}

toggleHistory(): void {
  this.showHistoryOnly = !this.showHistoryOnly;
}


  fetchTotalOrderCount(): void {
    this.shopifyService.getTotalOrderCount().subscribe((res) => {
      this.totalOrderCount = res.count;
    });
  }
  onTagChange(order: any) {
    this.shopifyService.saveOrderTag(
      order.id,
      order.selectedTag,
      order.financial_status,
      order.fulfillment_status,
      order.line_items || [] // fallback if undefined
    ).subscribe(() => {
      console.log(`Order ${order.id} tag updated to ${order.selectedTag}`);
    });
  }




}