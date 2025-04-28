# ESP32 IoT Weather Station App

Bu proje bir **ESP32 tabanlı IoT Hava Durumu İstasyonu** için geliştirilen mobil uygulamadır. 
ThingSpeak üzerinden sıcaklık, nem, basınç ve ışık şiddeti verilerini çekerek anlık grafikler 
ve son ölçümleri gösterir.

## Kullanılan Teknolojiler
- React Native
- react-native-chart-kit
- react-native-paper
- ThingSpeak API

## Özellikler
- Sıcaklık, nem, basınç ve ışık şiddeti ölçümlerinin grafikle gösterimi
- Anlık veri güncellemesi (30 saniyede bir)

## 🛠️ Kurulum
1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/KULLANICI_ADI/iot-weather-station-app.git
   cd iot-weather-station-app

2. Bağımlılıkları yükleyin:
   npm install

3. Ortam değişkenleri için .env dosyası oluşturun:
   Proje ana klasörüne .env dosyası açın.
   İçerisine şunları ekleyin:

   CHANNEL_ID=YOUR_CHANNEL_ID
   READ_API_KEY=YOUR_READ_API_KEY

4. babel.config.js dosyasını oluşturun ve aşağıdaki kodu yapıştırın:

   module.exports = function(api) {
      api.cache(true);
      return {
         presets: ['babel-preset-expo'],
         plugins: [
            ["module:react-native-dotenv"]
         ]
      };
   };
5. .gitignore dosyasına şunu ekleyin:

   .env

6. Uygulamayı cache temizleyerek başlatın:

   npx expo start -c