Şirket İhtiyaçları İçin Web Sitesi
Bu proje, bir şirketin çeşitli ihtiyaçlarını karşılamak amacıyla geliştirilmiş bir web uygulamasıdır. Node.js üzerinde geliştirilmiş olan bu uygulama, kullanıcıların güvenli bir şekilde işlem yapmasını sağlayan özelliklere sahiptir.

Özellikler
1. Kullanıcı Hesabı Oluşturma
Hesap Oluşturma: Yeni kullanıcılar sistemde hesap oluşturabilirler. hesap oluşturma işlemi, kullanıcı adı, e-posta adresi ve şifre ile gerçekleştirilir. Şifreler, güvenlik amacıyla şifrelenir ve veritabanında saklanır. ( aynı mail ile birden fazla hesap açılamaz)
2. Kullanıcı Girişi ve Token Yönetimi
Kullanıcı Girişi: Kullanıcılar, sistemde oturum açarak kişisel hesaplarına erişebilirler. giriş işlemi, e mail ve şifre ile gerçekleşir.
Token Tabanlı Kimlik Doğrulama: Kullanıcılar giriş yaptıktan sonra JWT kullanarak güvenli bir şekilde sistemde oturumlarını devam ettirirler. token API isteklerinde kimlik doğrulama için kullanılır.
3. İletişim Formu
Form Doldurma: Kullanıcılar, iletişim formunu doldurarak şirkete mesaj gönderebilirler. Form, kullanıcının adını, e-posta adresini, telefon numarasını ve mesajını içerir.
Kimlik Bilgileri: Formu dolduran kullanıcının kimliği, token doğrulaması ile doğrulanır ve form verisi ile birlikte saklanır.
4. İş Başvurusu
Başvuru Yapma: kullanıcılar iş başvuru formunu doldurarak şirkete başvuruda bulunabilirler. Form, başvurulan pozisyonu ve diğer gerekli bilgileri içerir.
CV ve Fotoğraf Ekleyebilme: Başvuru sırasında kullanıcılar özgeçmiş (CV) ve fotoğraf gibi belgeleri yükleyebilirler. 

Bunlar haricinde şirketiniz hakkında genel bilgi verebileceğiniz bir anasayfa ve verdiğiniz hizmetler hakkında bilgilendirici bir sayfa bulunmaktadır.


(MySQL) siteyi oluşturan sql tablolarının oluşturma komutları : 
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` text NOT NULL,
  `position` varchar(100) NOT NULL,
  `cv` mediumblob,
  `photo` mediumblob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `username` varchar(45) NOT NULL,
  `usermail` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

Örnek iletişim formu :
![image](https://github.com/user-attachments/assets/387a02f0-e880-4061-98e7-e63542ca4b4f)
![image](https://github.com/user-attachments/assets/2b24cbfe-1d0f-4dca-8ac8-57e232737fdc)

Örnek cv formu :
![image](https://github.com/user-attachments/assets/6c5852f2-e1fd-437c-8362-df9a9d7b478a)
![image](https://github.com/user-attachments/assets/25d632bf-91fa-4cc4-ab71-00e308cd976b)

Frontend üzerine çok düşülmemiştir; istediğiniz gibi düzenleme yapabilirsiniz.


