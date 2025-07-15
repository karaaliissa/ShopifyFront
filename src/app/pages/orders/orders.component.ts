import { Component } from '@angular/core';
import { ShopifyService } from '../../services/shopify.service';
import { MatDialog } from '@angular/material/dialog';
import { PackingListComponent } from '../../packing-list/packing-list.component';

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
  selectedOrderIds: number[] = [];
  allSelected = false;
  
  constructor(private shopifyService: ShopifyService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadOrders();
    this.fetchTotalOrderCount(); // ✅
    this.fetchTagCounts();

  }

  getCheckboxChecked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
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

  isOrderSelected(order: any): boolean {
    return this.selectedOrderIds.includes(order.id);
  }
  
  toggleOrderSelection(order: any, isChecked: boolean): void {
    if (isChecked) {
      if (!this.selectedOrderIds.includes(order.id)) {
        this.selectedOrderIds.push(order.id);
      }
    } else {
      this.selectedOrderIds = this.selectedOrderIds.filter(id => id !== order.id);
    }
  
    this.allSelected = this.filteredOrders.every(o => this.selectedOrderIds.includes(o.id));
  }
  
  toggleAllSelection(isChecked: boolean): void {
    this.allSelected = isChecked;
    this.selectedOrderIds = isChecked ? this.filteredOrders.map(o => o.id) : [];
  }
  onCheckboxChange(event: Event, order: any): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleOrderSelection(order, checked);
  }
    
  openPackingList() {
    const selectedOrders = this.orders.filter(o => this.selectedOrderIds.includes(o.id));
    if (selectedOrders.length === 0) return;
  
    this.dialog.open(PackingListComponent, {
      width: '900px',
      data: { orders: selectedOrders }
    });
  }
  getTranslatedVariant(variantTitle: string): string {
    if (!variantTitle) return '';
  
    const parts = variantTitle.split(' / ');
    const translatedParts = parts.map(part =>
      this.colorMap[part] || part
    );
  
    return translatedParts.join(' / ');
  }
  
  colorMap: { [key: string]: string } = {
    Red: 'أحمر',
    CherryRed: 'أحمر كرزي',
    DeepRed: 'أحمر غامق',
    Burgundy: 'أرجواني داكن',
    Oxblood: 'أحمر داكن',
    Pink: 'وردي',
    DustyPink: 'وردي باهت',
    Coral: 'مرجاني',
    Magenta: 'فوشي',
    Purple: 'أرجواني',
    RoyalBlue: 'أزرق ملكي',
    Navy: 'كحلي',
    LightBlue: 'أزرق فاتح',
    PowderBlue: 'أزرق باودر',
    SkyBlue: 'أزرق سماوي',
    Teal: 'تركوازي',
    Turquoise: 'فيروزي',
    Green: 'أخضر',
    EmeraldGreen: 'أخضر زمردي',
    Lime: 'ليموني',
    Mint: 'نعناعي',
    Yellow: 'أصفر',
    ButterYellow: 'أصفر زبدة',
    Mustard: 'أصفر خردلي',
    Orange: 'برتقالي',
    Peach: 'خوخي',
    Maroon: 'خمري',
    Brown: 'بني',
    ChocolateBrown: 'بني داكن',
    Beige: 'بيج',
    Ivory: 'عاجي',
    Cream: 'كريمي',
    Gray: 'رمادي',
    LightGray: 'رمادي فاتح',
    Charcoal: 'رمادي داكن',
    Black: 'أسود',
    White: 'أبيض',
    Gold: 'ذهبي',
    Silver: 'فضي',
    Champagne: 'شمبانيا',
    Taupe: 'توب',
    // Multicolor: 'متعدد الألوان'
  };
  
  
}
