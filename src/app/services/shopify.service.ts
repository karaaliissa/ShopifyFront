import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {
  private apiUrl = environment.API_BASE_URL;


  constructor(private http: HttpClient) { }

  getOrders(pageInfo?: string) {
    const url = pageInfo
      ? `${this.apiUrl}/orders?page_info=${pageInfo}`
      : `${this.apiUrl}/orders`;

    return this.http.get<{ orders: any[], nextPageInfo?: string }>(url);
  }

  getTotalOrderCount() {
    return this.http.get<{ count: number }>(`${this.apiUrl}/orders/count`);
  }

  saveOrderTag(orderId: number, newTag: string, financial_status?: string, fulfillment_status?: string, line_items: any[] = []) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.apiUrl}/save-order-tag`, {
      orderId,
      tag: newTag,
      financial_status,
      fulfillment_status,
      line_items
    }, { headers });
  }

  getTagCounts() {
    return this.http.get<{ total: number, countsByTag: Record<string, number> }>(`${this.apiUrl}/tag-counts`);
  }

  // (Optional) if still needed for comparison/stats
  private token = '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'; // remove or secure before production
  private shopifyBaseUrl = 'https://cropndtop.myshopify.com/admin/api/2024-01';

  getUnpaidOrderCount() {
    const headers = new HttpHeaders({
      'X-Shopify-Access-Token': this.token,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.shopifyBaseUrl}/orders/count.json?status=any&financial_status=pending`, { headers });
  }
}
