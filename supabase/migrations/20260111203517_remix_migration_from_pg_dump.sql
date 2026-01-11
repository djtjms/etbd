CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'user'
);


--
-- Name: generate_demo_slug(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_demo_slug() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base slug from title
  base_slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  
  -- If slug is already set and valid, keep it
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;
  
  -- Check for uniqueness and add counter if needed
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM public.demo_projects WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  allowed_emails TEXT[] := ARRAY['ceo@engineerstechbd.com', 'admin@engineerstechbd.com', 'info@engineerstechbd.com'];
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  
  -- Auto-assign admin role if email is in allowed list
  IF new.email = ANY(allowed_emails) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'user');
  END IF;
  
  RETURN new;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text,
    excerpt text,
    featured_image text,
    seo_title text,
    seo_description text,
    seo_keywords text[],
    status text DEFAULT 'draft'::text NOT NULL,
    author_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    published_at timestamp with time zone,
    CONSTRAINT blog_posts_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text])))
);


--
-- Name: branding_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.branding_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    logo_url text,
    logo_text text DEFAULT 'engineersTech'::text,
    tagline text DEFAULT 'Enterprise Tech Solutions for the Future'::text,
    primary_color text DEFAULT '#90FFA3'::text,
    company_email text DEFAULT 'info@engineerstechbd.com'::text,
    company_phone text DEFAULT '+880 1234-567890'::text,
    company_address text DEFAULT 'Dhaka, Bangladesh'::text,
    facebook_url text,
    linkedin_url text,
    twitter_url text,
    whatsapp_number text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: case_studies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    client_name text,
    technologies text[],
    featured_image text,
    gallery_images text[],
    results text,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT case_studies_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text])))
);


--
-- Name: chatbot_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chatbot_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    question_pattern text NOT NULL,
    response text NOT NULL,
    fallback_to_contact boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: consultation_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.consultation_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    interested_project text,
    message text,
    source text DEFAULT 'popup'::text,
    created_at timestamp with time zone DEFAULT now(),
    is_read boolean DEFAULT false
);


--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    subject text,
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: demo_project_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.demo_project_credentials (
    project_id uuid NOT NULL,
    access_username text,
    access_password text,
    access_code text,
    access_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: demo_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.demo_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    project_type text DEFAULT 'website'::text NOT NULL,
    demo_url text,
    thumbnail text,
    screenshots text[] DEFAULT '{}'::text[],
    technologies text[] DEFAULT '{}'::text[],
    is_featured boolean DEFAULT false NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    preview_mode text DEFAULT 'screenshot'::text,
    allow_interaction boolean DEFAULT true,
    view_count integer DEFAULT 0,
    slug text
);


--
-- Name: interaction_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interaction_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id text NOT NULL,
    event_type text NOT NULL,
    element_id text,
    element_type text,
    x_position integer,
    y_position integer,
    page_path text NOT NULL,
    project_id uuid,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: seo_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seo_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_name text NOT NULL,
    meta_title text,
    meta_description text,
    meta_keywords text[],
    og_image text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_name text NOT NULL,
    client_company text,
    client_position text,
    client_avatar text,
    review text NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT testimonials_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL
);


--
-- Name: visitor_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitor_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id text NOT NULL,
    page_path text NOT NULL,
    device_type text DEFAULT 'desktop'::text,
    scroll_depth integer DEFAULT 0,
    time_on_page integer DEFAULT 0,
    click_count integer DEFAULT 0,
    referrer text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);


--
-- Name: branding_settings branding_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branding_settings
    ADD CONSTRAINT branding_settings_pkey PRIMARY KEY (id);


--
-- Name: case_studies case_studies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies
    ADD CONSTRAINT case_studies_pkey PRIMARY KEY (id);


--
-- Name: case_studies case_studies_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies
    ADD CONSTRAINT case_studies_slug_key UNIQUE (slug);


--
-- Name: chatbot_config chatbot_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chatbot_config
    ADD CONSTRAINT chatbot_config_pkey PRIMARY KEY (id);


--
-- Name: consultation_requests consultation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consultation_requests
    ADD CONSTRAINT consultation_requests_pkey PRIMARY KEY (id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: demo_project_credentials demo_project_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_project_credentials
    ADD CONSTRAINT demo_project_credentials_pkey PRIMARY KEY (project_id);


--
-- Name: demo_projects demo_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_projects
    ADD CONSTRAINT demo_projects_pkey PRIMARY KEY (id);


--
-- Name: demo_projects demo_projects_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_projects
    ADD CONSTRAINT demo_projects_slug_key UNIQUE (slug);


--
-- Name: interaction_events interaction_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interaction_events
    ADD CONSTRAINT interaction_events_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: seo_settings seo_settings_page_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings
    ADD CONSTRAINT seo_settings_page_name_key UNIQUE (page_name);


--
-- Name: seo_settings seo_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings
    ADD CONSTRAINT seo_settings_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: visitor_analytics visitor_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitor_analytics
    ADD CONSTRAINT visitor_analytics_pkey PRIMARY KEY (id);


--
-- Name: idx_contact_submissions_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions USING btree (created_at DESC);


--
-- Name: idx_contact_submissions_is_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_submissions_is_read ON public.contact_submissions USING btree (is_read);


--
-- Name: idx_demo_projects_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_projects_featured ON public.demo_projects USING btree (is_featured DESC, created_at DESC);


--
-- Name: idx_demo_projects_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_projects_slug ON public.demo_projects USING btree (slug);


--
-- Name: idx_demo_projects_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_projects_status ON public.demo_projects USING btree (status);


--
-- Name: demo_projects generate_demo_slug_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER generate_demo_slug_trigger BEFORE INSERT OR UPDATE ON public.demo_projects FOR EACH ROW EXECUTE FUNCTION public.generate_demo_slug();


--
-- Name: demo_project_credentials set_demo_project_credentials_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_demo_project_credentials_updated_at BEFORE UPDATE ON public.demo_project_credentials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: blog_posts update_blog_posts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: branding_settings update_branding_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_branding_settings_updated_at BEFORE UPDATE ON public.branding_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: case_studies update_case_studies_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON public.case_studies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: demo_projects update_demo_projects_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_demo_projects_updated_at BEFORE UPDATE ON public.demo_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: seo_settings update_seo_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON public.seo_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: blog_posts blog_posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: interaction_events interaction_events_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interaction_events
    ADD CONSTRAINT interaction_events_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.demo_projects(id) ON DELETE SET NULL;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: blog_posts Admins can create blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can create blog posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: case_studies Admins can create case studies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can create case studies" ON public.case_studies FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: demo_projects Admins can create demos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can create demos" ON public.demo_projects FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: testimonials Admins can create testimonials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can create testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: blog_posts Admins can delete blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete blog posts" ON public.blog_posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: case_studies Admins can delete case studies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete case studies" ON public.case_studies FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: consultation_requests Admins can delete consultation requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete consultation requests" ON public.consultation_requests FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: contact_submissions Admins can delete contact submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete contact submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: demo_projects Admins can delete demos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete demos" ON public.demo_projects FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: testimonials Admins can delete testimonials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: branding_settings Admins can insert branding; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert branding" ON public.branding_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: seo_settings Admins can manage SEO settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage SEO settings" ON public.seo_settings TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: chatbot_config Admins can manage chatbot config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage chatbot config" ON public.chatbot_config TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: demo_project_credentials Admins can read demo credentials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can read demo credentials" ON public.demo_project_credentials FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: blog_posts Admins can update blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update blog posts" ON public.blog_posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: branding_settings Admins can update branding; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update branding" ON public.branding_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: case_studies Admins can update case studies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update case studies" ON public.case_studies FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: consultation_requests Admins can update consultation requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update consultation requests" ON public.consultation_requests FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: contact_submissions Admins can update contact submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: demo_projects Admins can update demos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update demos" ON public.demo_projects FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: testimonials Admins can update testimonials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: blog_posts Admins can view all blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all blog posts" ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: case_studies Admins can view all case studies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all case studies" ON public.case_studies FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: demo_projects Admins can view all demos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all demos" ON public.demo_projects FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: testimonials Admins can view all testimonials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all testimonials" ON public.testimonials FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: visitor_analytics Admins can view analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view analytics" ON public.visitor_analytics FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: consultation_requests Admins can view consultation requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view consultation requests" ON public.consultation_requests FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: contact_submissions Admins can view contact submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: interaction_events Admins can view interaction events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view interaction events" ON public.interaction_events FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: demo_project_credentials Admins can write demo credentials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can write demo credentials" ON public.demo_project_credentials USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: seo_settings Anyone can view SEO settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view SEO settings" ON public.seo_settings FOR SELECT USING (true);


--
-- Name: chatbot_config Anyone can view active chatbot config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active chatbot config" ON public.chatbot_config FOR SELECT USING ((is_active = true));


--
-- Name: branding_settings Anyone can view branding; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view branding" ON public.branding_settings FOR SELECT USING (true);


--
-- Name: testimonials Anyone can view featured testimonials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view featured testimonials" ON public.testimonials FOR SELECT USING ((is_featured = true));


--
-- Name: blog_posts Anyone can view published blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING ((status = 'published'::text));


--
-- Name: case_studies Anyone can view published case studies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published case studies" ON public.case_studies FOR SELECT USING ((status = 'published'::text));


--
-- Name: demo_projects Anyone can view published demos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published demos" ON public.demo_projects FOR SELECT USING ((status = 'published'::text));


--
-- Name: consultation_requests Public can submit consultation with validation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can submit consultation with validation" ON public.consultation_requests FOR INSERT WITH CHECK (((length(name) >= 2) AND (length(name) <= 100) AND (length(email) >= 5) AND (length(email) <= 255) AND (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)));


--
-- Name: contact_submissions Public can submit contact with rate limit awareness; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can submit contact with rate limit awareness" ON public.contact_submissions FOR INSERT WITH CHECK (((length(name) >= 2) AND (length(email) >= 5) AND (length(message) >= 10)));


--
-- Name: contact_submissions Public can submit contact with validation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can submit contact with validation" ON public.contact_submissions FOR INSERT WITH CHECK (((length(name) >= 2) AND (length(name) <= 100) AND (length(email) >= 5) AND (length(email) <= 255) AND (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text) AND (length(message) >= 10) AND (length(message) <= 5000)));


--
-- Name: interaction_events Public can track interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can track interactions" ON public.interaction_events FOR INSERT WITH CHECK (((length(session_id) >= 10) AND (length(page_path) >= 1) AND (length(page_path) <= 500) AND (length(event_type) >= 1) AND (length(event_type) <= 50)));


--
-- Name: visitor_analytics Public can track page views; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can track page views" ON public.visitor_analytics FOR INSERT WITH CHECK (((length(session_id) >= 10) AND (length(page_path) >= 1) AND (length(page_path) <= 500)));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: blog_posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

--
-- Name: branding_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: case_studies; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

--
-- Name: chatbot_config; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.chatbot_config ENABLE ROW LEVEL SECURITY;

--
-- Name: consultation_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: demo_project_credentials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.demo_project_credentials ENABLE ROW LEVEL SECURITY;

--
-- Name: demo_projects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.demo_projects ENABLE ROW LEVEL SECURITY;

--
-- Name: interaction_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.interaction_events ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: seo_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: testimonials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: visitor_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;