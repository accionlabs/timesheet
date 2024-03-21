create table Users (
    id int auto_increment primary key,
    `name` varchar(255),
    email varchar(255) not null unique,
    country varchar(100),
    timezone varchar(100),
    push_notification boolean default 0,
    email_notification boolean default 1,
    `uuid` char(36) default (uuid()) not null unique
);

create table Timesheets (
    id int auto_increment primary key,
    user_id int not null,
    `date_utc` datetime not null,
    `present` boolean default 0,
    `leave` boolean default 0,
    holiday boolean default 0,
    holiday_reason varchar(100),
    notes text,
    approval_id int,
    locked boolean default 0,
    `complete` boolean default 0,
    foreign key (user_id) references Users(id) on update cascade on delete cascade,
    unique (user_id, `date_utc`),
    check (not (`present` and `leave`) and not (`leave` and holiday))
);

create table Approvals (
    id int auto_increment primary key,
    `file` varchar(255),
    `month` int not null,
    `year` int not null,
    `user_id` int not null,
    foreign key (user_id) references Users(id) on update cascade on delete cascade,
    unique(`user_id`, `month`, `year`)
);