let sepet = [];

const isim = prompt('Adınız nedir?');
const yas = prompt('Yaşınız kaç?');
const meslek = prompt('Mesleğiniz nedir?');

const kullanici = { name: isim, age: parseInt(yas), job: meslek };
console.log('Kullanıcı Bilgileri: ', kullanici);

while (true) {
  const urunAdi = prompt(
    'Sepete eklemek istediğiniz ürünü yazın veya çıkmak için q yazabilirsiniz.'
  );

  if (urunAdi === 'q' || urunAdi === null) break;

  const fiyat = parseInt(prompt('Ürünün fiyatı: '));
  sepet.push({ product: urunAdi, price: fiyat });
  console.log(`${urunAdi} ürünü sepete eklendi. Fiyat: ${fiyat} TL`);
}

console.log('Sepetiniz: ', sepet);

const toplamFiyat = sepet.reduce((toplam, urun) => toplam + urun.price, 0);
console.log(`Toplam Fiyat: ${toplamFiyat} TL`);

const cikarilacakUrun = prompt('Çıkarmak istediğiniz ürünün adını girin (çıkmak için q): ');
if (cikarilacakUrun !== null && cikarilacakUrun !== 'q') {
  const urunIndex = sepet.findIndex((urun) => urun.product === cikarilacakUrun);
  if (urunIndex !== -1) {
    sepet.splice(urunIndex, 1);
    console.log(`${cikarilacakUrun} ürünü sepetten çıkarıldı.`);
    console.log('Güncel Sepetiniz: ', sepet);
    
    const yeniToplam = sepet.reduce((toplam, urun) => toplam + urun.price, 0);
    console.log(`Güncel Toplam Fiyat: ${yeniToplam} TL`);
  } else {
    console.log('Bu isimde bir ürün sepetinizde bulunamadı.');
  }
}

