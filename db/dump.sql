--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4
-- Dumped by pg_dump version 10.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Russian_Russia.1251' LC_CTYPE = 'Russian_Russia.1251';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    login character varying(50),
    password_hash text,
    name character varying(200),
    email character varying(50),
    manager boolean,
    blocked boolean,
    data jsonb,
    created timestamp without time zone,
    updated timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.users IS 'Таблица с тестовыми пользователями';


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (user_id, login, password_hash, name, email, manager, blocked, data, created, updated) VALUES (3, 'user', 'b7a8e73e6a45795a6437266d0c48ea73', 'Пользователь системы', 'user@user.ru', NULL, NULL, '{}', '2018-07-17 20:38:03.937', '2018-07-17 20:38:04.958');
INSERT INTO public.users (user_id, login, password_hash, name, email, manager, blocked, data, created, updated) VALUES (2, 'manager', '01cfcd4f6b8770febfb40cb906715822', 'Менеджер системы', 'manager@manager.ru', true, false, '{}', '2018-07-17 20:37:11.052', '2018-07-17 20:37:12.241');
INSERT INTO public.users (user_id, login, password_hash, name, email, manager, blocked, data, created, updated) VALUES (1, 'admin', '827ccb0eea8a706c4c34a16891f84e7b', 'Администратор системы', 'admin@admin.ru', true, NULL, '{"birthday": "2018-07-17T02:54:57.943Z"}', '2018-07-17 20:15:41.192', '2018-07-17 20:15:42.714');
INSERT INTO public.users (user_id, login, password_hash, name, email, manager, blocked, data, created, updated) VALUES (4, 'blocked_user', '4cc2321ca77b832bd20b66f86f85bef6', 'Заблокированный пользователь', 'user@user.ru', NULL, true, '{"birthday": "2018-07-17T02:54:57.943Z"}', '2018-07-17 20:39:49.982', '2018-07-17 20:39:50.952');
INSERT INTO public.users (user_id, login, password_hash, name, email, manager, blocked, data, created, updated) VALUES (6, 'manager_2', '01cfcd4f6b8770febfb40cb906715822', 'Заблокированный менеджер системы', 'manager2@manager.ru', true, NULL, NULL, '2018-07-17 20:44:07.517', '2018-07-17 20:44:08.868');
INSERT INTO public.users (user_id, login, password_hash, name, email, manager, blocked, data, created, updated) VALUES (5, 'user_2', '4cc2321ca77b832bd20b66f86f85bef6', 'Пользователь системы 2', 'user2@user.ru', false, false, '{"birthday": "2018-07-17T02:54:57.943Z"}', '2018-07-17 20:41:29.372', '2018-07-17 20:41:30.464');


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- Name: users users_user_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_id_pk PRIMARY KEY (user_id);


--
-- Name: users_login_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_login_index ON public.users USING btree (login);


--
-- Name: users_login_password_hash_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_login_password_hash_index ON public.users USING btree (login, password_hash);


--
-- Name: users_user_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_user_id_uindex ON public.users USING btree (user_id);


--
-- PostgreSQL database dump complete
--

