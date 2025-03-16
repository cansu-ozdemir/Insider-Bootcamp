# Dinamik Kullanıcı Yönetim Uygulaması

Bu proje, bir API'den kullanıcı verilerini çekerek görüntüleyen, localStorage ile saklayan ve kullanıcı etkileşimleri sunan bir JavaScript uygulamasıdır.

## Proje Özellikleri

- Dinamik olarak değiştirilebilen hedef eleman seçicisi (`appendLocation`)
- API'den kullanıcı verilerini çekme ve listeleme
- Kullanıcıları silme işlevi ve verileri güncelleme
- Verinin 24 saat boyunca localStorage'da saklanması
- MutationObserver ile DOM değişikliklerini izleme
- Tüm kullanıcılar silindiğinde "Yeniden Yükle" butonu gösterme
- sessionStorage kullanarak, oturum başına yalnızca 1 kez yeniden yüklemeye izin verme

## Teknik Detaylar

### appendLocation Değişkeni

Kod bloğunun en üstünde tanımlanan bu değişken, uygulamanın hangi HTML elemanına içerik ekleyeceğini belirler. Böylece uygulamayı farklı sayfalara entegre etmek kolaylaşır.

### Veri Saklama

Uygulama, kullanıcı verilerini ve son güncelleme zamanını tek bir localStorage nesnesinde saklar. Son güncelleme zamanı, verilerin 24 saat içinde yenilenip yenilenmeyeceğini belirlemek için kullanılır. Tüm kullanıcılar silindiğinde, "Yeniden Yükle" butonu sadece bir kez görünecek şekilde sessionStorage ile kontrol edilir.

### Kullanıcı Arayüzü Bileşenleri

- **Kullanıcı Kartları**: Her kullanıcı için ad, e-posta, telefon ve adres bilgilerini içeren kartlar oluşturulur.
- **Silme Butonu**: Her kullanıcı kartında, kullanıcıyı silmek için bir buton bulunur.
- **Yeniden Yükle Butonu**: Tüm kullanıcılar silindiğinde, yeni kullanıcılar yüklemek için yalnızca bir kez kullanılır.

### MutationObserver

MutationObserver, DOM'daki değişiklikleri izlemek için kullanılır. Özellikle, tüm kullanıcılar silindiğinde "Yeniden Yükle" butonunun eklenmesini ve bu butona tıklama olayı dinleyicisi eklenmesini sağlar.

### Oturum Yönetimi

Kullanıcı "Yeniden Yükle" butonuna tıkladığında, bu işlem sessionStorage'a kaydedilir. Bu sayede, aynı oturum içinde buton bir daha kullanılamaz.

## Hata Yönetimi

Uygulama, aşağıdaki hata durumları için önlemler içerir:

- API'den veri çekme başarısız olduğunda hata mesajı gösterme
- localStorage'daki verilerin bozulması durumunda sıfırlama ve temizleme
- Eksik ya da geçersiz kullanıcı verisi durumunda uygun mesaj gösterme

## Kod Organizasyonu

Kod, aşağıdaki ana fonksiyonlara ayrılmıştır:

- `createStyles()`: CSS stillerini dinamik olarak ekler
- `isDataExpired()`: LocalStorage'daki verinin süresinin dolup dolmadığını kontrol eder
- `displayUsers()`: Kullanıcı verilerini görüntüler
- `deleteUser()`: Kullanıcıyı siler ve verileri günceller
- `fetchUsers()`: API'den kullanıcı verilerini çeker
- `observeUserContainer()`: DOM değişikliklerini izleyerek buton yönetimini sağlar
- `init()`: Uygulamayı başlatır

## Test Ortamı

Bu uygulamayı yerel ortamda test etmek için basit bir HTML dosyası (`index.html`) oluşturdum.