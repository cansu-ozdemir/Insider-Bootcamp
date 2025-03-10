# Mini E-Ticaret / Ürün Kataloğu Uygulaması

## Projenin Tanıtımı

Bu proje, **jQuery ve AJAX** kullanarak bir **mini e-ticaret / ürün kataloğu** oluşturmayı amaçlayan bir uygulamadır. **Fake Store API**'den ürün bilgileri (İsim, fiyat, fotoğraf, açıklama vb.) dinamik olarak çekilip, HTML yapısı içinde jQuery ile eklenmektedir. Kullanıcılar ürünleri listeleyebilir, sepete ekleyebilir, favorilere kaydedebilir ve ürün detaylarını modal üzerinden inceleyebilir.

Projede **Local Storage** kullanılarak, kullanıcının sepetine eklediği veya favoriye aldığı ürünler kaydedilir ve sayfa yenilense bile veriler korunur. Ek olarak, **karanlık mod desteği**, **ürün arama**, **dinamik filtreleme**, **tooltip ile sepet önizleme** ve **ürün kaydırmalı (slider) gösterim** gibi ek fonksiyonlar sunulmuştur.

## Öne Çıkan Özellikler

### Ödev Gereksinimlerine Uygun Olarak Yapılanlar:

- ✅ **Fake Store API** kullanılarak **jQuery AJAX** ile ürünler çekildi ve HTML yapısına eklendi.
- ✅ **"Sepete Ekle" ve "Hızlı Bakış" butonları** eklendi, detay görüntüleme **FancyBox modal** üzerinden yapıldı.
- ✅ **Sepet işlemleri** yapıldı: Sepete ekleme, miktar güncelleme ve sepeti temizleme.
- ✅ **Local Storage kullanılarak** sepet verileri kaydedildi.
- ✅ **Sepeti Temizle** butonu `.empty()` kullanarak DOM ve Local Storage verilerini sildi.
- ✅ **jQuery Animasyonları**: Ürün ekleme, hover efektleri, buton animasyonları eklendi.
- ✅ **Traversing ve Cloning**: Sepete ekleme işlemi `.clone()` ile yapıldı, `.closest()`, `.find()` gibi traversing metotları ile dinamik elementlere erişim sağlandı.
- ✅ **Event Delegation**: Dinamik eklenen öğeler için `.on()` ile event delegasyonu sağlandı.
- ✅ **Slider/Carousel**: Öne çıkan ürünleri kaydırmalı gösterim için slider eklendi.

### Ekstra Eklenen Yenilikler:

- ✅ **Karanlık Mod (Dark Mode) Desteği**: Kullanıcının tercihine göre sayfa aydınlık veya karanlık moda geçebiliyor ve bu tercih **Local Storage**'a kaydediliyor.
- ✅ **Favori Ürünler Sistemi**: Kullanıcılar ürünleri favoriye ekleyebiliyor ve favori listesi Local Storage'da saklanıyor.
- ✅ **Tooltip ile Sepet Önizleme**: Kullanıcı, sepet simgesinin üzerine geldiğinde tooltip içinde sepetteki ürünleri önizleyebiliyor.
- ✅ **Ürün Arama Sistemi**: Kullanıcılar, **ürün ismine veya açıklamasına göre arama yapabiliyor**. Arama sürecinde **debounce mekanizması** kullanılarak performans iyileştirildi.
- ✅ **Dinamik Filtreleme Sistemi**: Ürünler **kategoriye göre filtrelenebiliyor**.
- ✅ **Sepette Ürün Miktarı Güncelleme**: Kullanıcılar sepete ekledikleri ürünlerin miktarını **artırabilir veya azaltabilir.**
- ✅ **Sepet Toplam Fiyat Hesaplama**: Sepetteki ürünlerin **toplam fiyatı otomatik olarak hesaplanıyor.**
- ✅ **Hata Yönetimi**: API isteği başarısız olursa **kullanıcıya hata mesajı gösteriliyor.**
- ✅ **Buton Hover Efektleri**: Kullanıcı deneyimini iyileştirmek için butonların üzerine gelindiğinde yumuşak animasyonlar eklendi.

## Kullanılan Teknolojiler

- **HTML & CSS**: Sayfa yapısı ve stil tasarımı.
- **jQuery**: DOM manipülasyonu, event handling, AJAX istekleri.
- **AJAX & JSON**: Fake Store API'den ürün verilerinin çekilmesi.
- **Local Storage**: Kullanıcının sepet ve favori verilerinin kaydedilmesi.
- **jQuery Animasyonları**: `fadeIn()`, `slideDown()`, `toggleClass()`, `animate()` vb.
- **FancyBox**: Ürün detaylarını modal içinde büyüterek görüntüleme.
- **Slick Carousel**: Öne çıkan ürünleri kaydırmalı görüntüleme.
- **Event Delegation (`on()`)**: Dinamik eklenen öğeler için event atama.
- **Debounce (Performans Optimizasyonu)**: Arama kutusunda gereksiz AJAX isteklerini azaltmak için kullanıldı.