drop database if exists DB_Library ;
create database DB_Library ;
use DB_Library;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

CREATE TABLE livres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    sourceImg VARCHAR(200) NOT NULL,
    typeLivre VARCHAR(200) NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    description TEXT
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    ID_user INT NOT NULL,             
    total_prix DECIMAL(10, 2) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (ID_user) REFERENCES users(id)      
);

CREATE TABLE panier (
    ID_panier INT AUTO_INCREMENT PRIMARY KEY,
    ID_user INT NOT NULL,
    ID_livre INT NOT NULL,
    quantite INT NOT NULL DEFAULT 1,
    FOREIGN KEY (ID_user) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ID_livre) REFERENCES livres(id) ON DELETE CASCADE
);

INSERT INTO livres(nom,typeLivre,PRIX,Sourceimg, Description) VALUES 
('Autobiographie Scientifique', 'science', 79.61, '../DB/Images_Livres/science/1052420-f.jpg', 'Description for Autobiographie Scientifique.'),
('The mirror of arccena', 'roman', 75.36, '../DB/Images_Livres/roman/1213473-f.jpg', 'Description for The mirror of arccena.'),
('Germinal', 'science', 61.86, '../DB/Images_Livres/science/1261741-f.jpg', 'Description for Germinal.'),
('Thérese Raquin', 'philosophie', 52.93, '../DB/Images_Livres/philosophie/1462516-f.jpg', 'Description for Thérese Raquin.'),
('Le luxe et la violence', 'philosophie', 74.24, '../DB/Images_Livres/philosophie/1521573-f.jpg', 'Description for Le luxe et la violence.'),
('Q', 'roman', 95.89, '../DB/Images_Livres/roman/1554131-f.jpg', 'Description for Q.'),
('Max Planck et les quanta', 'roman', 21.87, '../DB/Images_Livres/roman/1896221-f.jpg', 'Description for Max Planck et les quanta.'),
('Einstein en 30 secondes', 'roman', 61.63, '../DB/Images_Livres/roman/2146141-f.jpg', 'Description for Einstein en 30 secondes1.'),
('lE DERNIER JOUR D UN CONDAMNÉ', 'philosophie', 21.3, '../DB/Images_Livres/philosophie/2162278-f.jpg', 'Description for lE DERNIER JOUR D UN CONDAMNÉ.'),
('The jazz of Physics', 'roman', 40.34, '../DB/Images_Livres/roman/2250705-f.jpg', 'Description for The jazz of Physics.'),
('Les Misérables', 'science', 20.43, '../DB/Images_Livres/science/2264162-f.jpg', 'Description for Les Misérables.'),
('Special and general relativité', 'philosophie', 39.68, '../DB/Images_Livres/philosophie/3229558-f.jpg', 'Description for Special and general relativité.'),
('La ferme des animaux', 'roman', 69.02, '../DB/Images_Livres/roman/3342040-f.jpg', 'Description for La ferme des animaux.'),
('Madame Curie', 'philosophie', 44.92, '../DB/Images_Livres/philosophie/3570872-f.jpg', 'Description for Madame Curie.'),
('Le mystére du satellite Planck', 'science', 26.19, '../DB/Images_Livres/science/3628502-f.jpg', 'Description for Le mystére du satellite Planck.'),
('Le monde des sciences', 'roman', 54.77, '../DB/Images_Livres/roman/3681290-f.jpg', 'Description for Le monde des sciences.'),
('Terra Nullius', 'philosophie', 81.13, '../DB/Images_Livres/philosophie/3693952-f.jpg', 'Description for Terra Nullius.'),
('Time travelleries theory', 'roman', 90.9, '../DB/Images_Livres/roman/3750028-f.jpg', 'Description for Time travelleries theory.'),
('La menace nucléaire', 'roman', 77.73, '../DB/Images_Livres/roman/3787525-f.jpg', 'Description for La menace nucléaire.'),
('General Relativité', 'philosophie', 62.11, '../DB/Images_Livres/philosophie/3801100-f.jpg', 'Description for General Relativité .'),
('Victor Hugo', 'roman', 36.51, '../DB/Images_Livres/roman/3952179-f.jpg', 'Description for Victor Hugo.'),
('Ibn Sina', 'philosophie', 38.32, '../DB/Images_Livres/philosophie/4011758-f.jpg', 'Description for Ibn Sina.'),
('La derniére Guerre', 'science', 40.98, '../DB/Images_Livres/science/4182452-f.jpg', 'Description for La derniére Guerre.'),
('Marie Curie', 'science', 79.0, '../DB/Images_Livres/science/4200510-f.jpg', 'Description for Marie Curie.'),
('Ibn Khaldun', 'science', 33.39, '../DB/Images_Livres/science/4218689-f.jpg', 'Description for Ibn Khaldun.'),
('Les Illusionnistes', 'science', 77.35, '../DB/Images_Livres/science/4219879-f.jpg', 'Description for Les Illusionnistes.'),
('Le reve de Mare Auréle', 'philosophie', 57.57, '../DB/Images_Livres/philosophie/4251544-gf.jpg', 'Description for Le reve de Mare Auréle.'),
('La guerre Nucleaire', 'science', 66.32, '../DB/Images_Livres/science/4253270-f.jpg', 'Description for La guerre Nucleaire.'),
('Les secrets de la femme de menage', 'roman', 12.9, '../DB/Images_Livres/roman/4266094-gf.jpg', 'Description for Les secrets de la femme de menage.'),
('lE MYSTÉRE D ALBERT EINSTEIN', 'science', 40.84, '../DB/Images_Livres/science/4281661-f.jpg', 'Description for lE MYSTÉRE D ALBERT EINSTEIN.'),
('L existentialisme est un humanisme', 'roman', 88.4, '../DB/Images_Livres/roman/5301-f.jpg', 'Description for L existentialisme est un humanisme.'),
('Germinal', 'roman', 86.16, '../DB/Images_Livres/roman/5863-f.jpg', 'Description for Germinal.'),
('The Life of Emile Zola', 'roman', 79.94, '../DB/Images_Livres/roman/612631-f.jpg', 'Description for The Life of Emile Zola.'),
('1984', 'philosophie', 58.85, '../DB/Images_Livres/philosophie/956972-f.jpg', 'Description for 1894.'),
('Animal Farm', 'philosophie', 56.68, '../DB/Images_Livres/philosophie/956973-f.jpg', 'Description for Animal Farm.'),
('la_nausse', 'philosophie', 80.33, '../DB/Images_Livres/philosophie/la_nausse.jpg', 'Description for la nausse');