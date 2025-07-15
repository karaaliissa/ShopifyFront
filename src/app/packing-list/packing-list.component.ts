import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.scss'],
  standalone : false
})
export class PackingListComponent {
  summaryItems: any[] = [];
  selectedOrders: any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  const orders = data.orders || [];

  const itemMap = new Map();
  orders.forEach((order: any) => {
    (order.line_items || []).forEach((item: any) => {
      const key = `${item.title} | ${item.variant_title}`;
      if (!itemMap.has(key)) {
        itemMap.set(key, {
          title: item.title,
          variant: item.variant_title,
          quantity: 0,
          image: item.image || '',
          orders: []
        });
      }
      const entry = itemMap.get(key);
      entry.quantity += item.quantity;
      entry.orders.push(order.name || `#${order.id}`);
    });
  });

  this.summaryItems = Array.from(itemMap.values());
}

  toggleOrderSelection(order: any, isChecked: boolean) {
    if (isChecked) {
      this.selectedOrders.push(order);
    } else {
      this.selectedOrders = this.selectedOrders.filter(o => o.id !== order.id);
    }
  }
  // openPackingList() {
  //   this.dialog.open(PackingListComponent, {
  //     width: '900px',
  //     data: { orders: this.selectedOrders }
  //   });
  // }
  print(): void {
    window.print();
  }
  extractImageFromProperties(properties: any[]): string | null {
    if (!properties || !Array.isArray(properties)) return null;
    const imageProp = properties.find(p => p.name.toLowerCase() === 'image');
    return imageProp?.value || null;
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
