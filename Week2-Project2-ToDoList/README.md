# Görev Yönetim Uygulaması

## Proje Tanıtımı
Bu uygulama, kullanıcıların görevlerini daha sistematik bir şekilde yönetmesine yardımcı olur. Görevlerin tamamlanma durumu, öncelik seviyeleri ve sıralama seçenekleri ile organize bir iş akışı sunar.

### Kullanılan Teknolojiler
- HTML
- CSS (Animasyonlar, Flexbox, CSS Değişkenleri)
- JavaScript (ES6+, IIFE Pattern, Event Delegation)
- Font Awesome (İkonlar)

## Özellikler

### Görev İşlemleri
- **Görev Ekleme**: Başlık (zorunlu), açıklama ve öncelik seçimi ile oluşturma
- **Tamamlama & Geri Alma**: Görevleri tamamlandı olarak işaretleme veya geri alma
- **Görev Silme**: Kalıcı olarak kaldırma
- **Sürükle-Bırak**: Görevleri elle sıralama desteği

### Filtreleme ve Sıralama
- Tamamlanma durumuna göre filtreleme (Tümü/Tamamlananlar/Tamamlanmayanlar)
- Öncelik seviyesine göre filtreleme (Tümü/Yüksek/Orta/Düşük)
- Görevleri öncelik veya oluşturma tarihine göre sıralama

### Kullanıcı Deneyimi
- Önceliğe göre renk kodlaması (kırmızı: yüksek, sarı: orta, yeşil: düşük)
- Tamamlanan görevler için görsel geri bildirim (üzeri çizili gösterim)
- Animasyonlar ile zenginleştirilmiş arayüz etkileşimleri
- Responsive tasarım ile tüm cihazlarda uyumluluk



## Teknik Detaylar

### JavaScript İmplementasyonu
TaskManager modülü, IIFE pattern ile kapsüllenmiş olup aşağıdaki ana fonksiyon gruplarını içerir:

#### Temel Fonksiyonlar
- **Çekirdek İşlemler**: `init()`, `registerEventListeners()`, `updateUI()`
- **Görev Yönetimi**: `addNewTask()`, `deleteTask()`, `toggleTaskCompletion()`
- **Filtreleme/Sıralama**: `toggleCompletedFilter()`, `handlePriorityFilter()`, `handleSort()`
- **Olay İşleme**: `onFormSubmit()`, `onTaskClick()`, drag-drop fonksiyonları
- **Arayüz**: `renderTasks()`, `showError()`, `resetForm()`

### Uygulama Mimarisi
- **Kapsülleme**: IIFE ile global namespace kirlilik önleme
- **Olay Delegasyonu**: Dinamik elementler için verimli event handling
- **Durum Yönetimi**: Merkezi görev listesi ve filtre durumu
- **Validasyon**: Form ve veri doğrulama kontrolleri
- **Hata Yakalama**: Try-catch ile hatalardan korunma
