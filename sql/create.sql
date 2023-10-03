create database Workshop;

use Workshop;

create table Users(
    id int primary key auto_increment;
    prenom varchar(64) not null,
    nom varchar(64) not null,
    mail varchar(127) not null,
    password varchar(127) not null,
    Type_compte varchar(24) not null,
    Latitude double,
    Longitude double,
    profession char(256) not null
)

create table Entreprise(
    id int primary key auto_increment,
    nom varchar(127) not null,
    Mail varchar(127) not null
    password varchar(127) not null,
    id_user int,
    Foreign key(id_user) references Users(id)
)

create table Produits(
    id int not null primary key auto_increment,
    nom varchar(64) not null,
    prix double not null default 0.00,
    type_produit not null,
    id_entreprise int,

    foreign key (id_entreprise) references Entreprise(id)
)

create table Services(
    nom varchar(64) not null,
    Prix double not null default 0.00,
    type_service not null,
    id_entreprise int,

    foreign key (id_entreprise) references Entreprise(id)
)