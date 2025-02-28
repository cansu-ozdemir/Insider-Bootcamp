let sepet = [];

const isim = prompt('Adınız nedir?') || 'Misafir';

let yas = prompt('Yaşınız kaç?');

while (isNaN(parseInt(yas)) || yas === "" || yas === null) {
  alert('Lütfen yaşınız için geçerli bir sayı girin!');
  yas = prompt('Yaşınız kaç?');

  if (yas === null) {
    yas = '0';
    break;
  }
}
const yasInt = parseInt(yas);

const meslek = prompt('Mesleğiniz nedir?') || 'Belirtilmedi';

const kullanici = { name: isim, age: yasInt, job: meslek };
console.log('Kullanıcı Bilgileri: ', kullanici);

while (true) {
  const urunAdi = prompt(
    'Sepete eklemek istediğiniz ürünü yazın veya çıkmak için q yazabilirsiniz.'
  );

  if (urunAdi === 'q' || urunAdi === null || urunAdi.trim() === '') break;


  let fiyat = prompt('Ürünün fiyatı: ');

  if (fiyat === null) {
    alert("Ürün ekleme işlemi iptal edildi.");
    continue;
  }

  while(isNaN(parseFloat(fiyat)) || fiyat === "") {
    alert('Lütfen fiyat için geçerli bir sayı girin!');
    fiyat = prompt('Ürünün fiyatı: ');

    if (fiyat === null) {
      alert("Ürün ekleme işlemi iptal edildi.");
      continue;
    }
  }

  const fiyatFloat = parseFloat(fiyat);

  const urunVarMi = sepet.find(urun => urun.product.toLowerCase() === urunAdi.toLowerCase());

  if (urunVarMi) {
    urunVarMi.quantity += 1;
    urunVarMi.totalPrice += fiyatFloat;
    console.log(`${urunAdi} ürününün miktarı artırıldı. Yeni miktar: ${urunVarMi.quantity}, Toplam Fiyat: ${urunVarMi.totalPrice.toFixed(2)} TL`);
  } else {
    sepet.push ({
      product: urunAdi,
      price: fiyatFloat,
      quantity: 1,
      totalPrice: fiyatFloat
    });

  console.log(`${urunAdi} ürünü sepete eklendi. Fiyat: ${fiyatFloat.toFixed(2)} TL`);
  }
}

if (sepet.length > 0) {
  console.log('Sepetiniz: ', sepet);

  const toplamFiyat = sepet.reduce((toplam, urun) => toplam + urun.totalPrice, 0);
  console.log(`Toplam Fiyat: ${toplamFiyat.toFixed(2)} TL`);

  const cikarilacakUrun = prompt('Çıkarmak istediğiniz ürünün adını girin (çıkmak için q): ');

  if (cikarilacakUrun !== null && cikarilacakUrun !== 'q' && cikarilacakUrun.trim() !== '') {
    const urunIndex = sepet.findIndex((urun) => urun.product.toLowerCase() === cikarilacakUrun.toLowerCase());

    if (urunIndex !== -1) {
      const urun = sepet[urunIndex];

      const miktar = parseInt(prompt(`Kaç tane ${cikarilacakUrun} çıkarmak istiyorsunuz? (Mevcut miktar: ${urun.quantity})`));

      if (!isNaN(miktar) && miktar > 0) {
        if(miktar >= urun.quantity) {
          sepet.splice(urunIndex, 1);
          console.log(`${cikarilacakUrun} ürünü sepetten tamamen çıkarıldı.`);
        } else {
          urun.quantity -= miktar;
          urun.totalPrice = urun.price * urun.quantity;
          console.log(`${miktar} adet ${cikarilacakUrun} ürünü sepetten çıkarıldı. Kalan miktar: ${urun.quantity}`);
        }

        console.log('Güncel Sepetiniz: ', sepet);

        const yeniToplam = sepet.reduce((toplam, urun) => toplam + urun.totalPrice, 0);
        console.log(`Güncel Toplam Fiyat: ${yeniToplam.toFixed(2)} TL`);
      } else {
        console.log ('Geçersiz miktar girdiniz, ürün çıkarma işlemi iptal edildi.')
      }
    } else {
      console.log('Bu isimde bir ürün sepetinizde bulunamadı.');
    }
  }
} else {
  console.log('Sepetinizde ürün bulunmamaktadır.');
}

