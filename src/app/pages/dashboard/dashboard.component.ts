import { Component } from '@angular/core';
import { ShopifyService } from '../../services/shopify.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  totalOrders = 0;
  unpaidOrders = 0;

  constructor(private shopifyService: ShopifyService) {}

  ngOnInit(): void {
    this.shopifyService.getOrders().subscribe((res: any) => {
      this.totalOrders = res.orders.length;

      // simulate your own status breakdown
      this.unpaidOrders = res.orders.filter((o: any) => o.financial_status === 'pending').length;
    });
  }
}
