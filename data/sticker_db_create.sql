CREATE TABLE public.users (
  "_id" serial NOT NULL,
  "name" varchar NOT NULL,
  "sales_id" bigint,
  "sessions_id" bigint NOT NULL,
  "saved_stickers_id" bigint,
  CONSTRAINT "users_pk" PRIMARY KEY ("_id")
);

CREATE TABLE public.sales (
  "_id" serial NOT NULL,
  "date" DATE NOT NULL,
  "total" serial NOT NULL,
  "customer_id" serial NOT NULL,
  CONSTRAINT "sales_pk" PRIMARY KEY ("_id")
);

CREATE TABLE public.sales_detail (
  "sales_id" serial NOT NULL,
  "sticker_item" serial NOT NULL,
  "quantity" serial NOT NULL,
  CONSTRAINT "sales_detail_pk" PRIMARY KEY ("sales_id")
);

CREATE TABLE public.sessions (
  "_id" serial NOT NULL,
  CONSTRAINT "sessions_pk" PRIMARY KEY ("_id")
);

CREATE TABLE public.saved_stickers (
  "_id" serial NOT NULL,
  CONSTRAINT "saved_stickers_pk" PRIMARY KEY ("_id")
);

ALTER TABLE public.users ADD CONSTRAINT "users_fk0" FOREIGN KEY ("sales_id") REFERENCES public.sales("_id");
ALTER TABLE public.users ADD CONSTRAINT "users_fk1" FOREIGN KEY ("sessions_id") REFERENCES public.sessions("_id");
ALTER TABLE public.users ADD CONSTRAINT "users_fk2" FOREIGN KEY ("saved_stickers_id") REFERENCES public.saved_stickers("_id");

ALTER TABLE public.sales ADD CONSTRAINT "sales_fk0" FOREIGN KEY ("customer_id") REFERENCES public.users("_id");


