import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {
  private apiUrl = 'https://shopify-proxy-wlo0.onrender.com/api';
  private authToken = 'd172de1719f2ae3a0a1964e7b65fe505'; // 👈 Match with proxy .env

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const jwtToken = localStorage.getItem('jwt_token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-App-Token': this.authToken,
      'Authorization': `Bearer ${jwtToken}`
    });
  }
  
  getOrders(pageInfo?: string) {
    const url = pageInfo
      ? `${this.apiUrl}/orders?page_info=${pageInfo}`
      : `${this.apiUrl}/orders`;

    return this.http.get<{ orders: any[], nextPageInfo?: string }>(url, {
      headers: this.getHeaders()
    });
  }

  getTotalOrderCount() {
    return this.http.get<{ count: number }>(`${this.apiUrl}/orders/count`, {
      headers: this.getHeaders()
    });
  }

  getUnpaidOrderCount() {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unpaid-order-count`, {
      headers: this.getHeaders()
    });
  }

  saveOrderTag(orderId: number, newTag: string, financial_status?: string, fulfillment_status?: string, line_items: any[] = []) {
    return this.http.post(`${this.apiUrl}/save-order-tag`, {
      orderId,
      tag: newTag,
      financial_status,
      fulfillment_status,
      line_items
    }, {
      headers: this.getHeaders()
    });
  }

  getTagCounts() {
    return this.http.get<{ total: number, countsByTag: Record<string, number> }>(
      `${this.apiUrl}/tag-counts`, { headers: this.getHeaders() }
    );
  }
  
}
