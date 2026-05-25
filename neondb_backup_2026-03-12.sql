--
-- PostgreSQL database dump
--

\restrict q3dNTWjqMWmK3s5O6ERAcxg4KP91vF0IgYt7ppU6jdM5Br9y9PIB7ttDMCIf3YT

-- Dumped from database version 17.8 (6108b59)
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

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'Present',
    'Late',
    'Half_Day',
    'Absent'
);


--
-- Name: LeadSource; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LeadSource" AS ENUM (
    'Website',
    'Referral',
    'Cold_Call',
    'Email'
);


--
-- Name: LeadStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LeadStatus" AS ENUM (
    'New',
    'Not_Responded',
    'Wrong_Contact',
    'Follow_Up',
    'Prospect',
    'Hot_Prospect',
    'Proposal_Sent',
    'Closing',
    'Won',
    'Lost'
);


--
-- Name: LeaveStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LeaveStatus" AS ENUM (
    'Pending',
    'Approved',
    'Rejected'
);


--
-- Name: LeaveType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LeaveType" AS ENUM (
    'Sick',
    'Casual',
    'Annual',
    'Unpaid'
);


--
-- Name: ProductStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ProductStatus" AS ENUM (
    'Draft',
    'Active',
    'Discontinued'
);


--
-- Name: ProjectStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ProjectStatus" AS ENUM (
    'Planning',
    'Active',
    'On_Hold',
    'Completed',
    'Cancelled'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    "employeeId" integer NOT NULL,
    module text NOT NULL,
    action text NOT NULL,
    "entityId" text,
    "entityName" text,
    description text NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    "employeeId" integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "checkIn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "checkOut" timestamp(3) without time zone,
    status public."AttendanceStatus" DEFAULT 'Present'::public."AttendanceStatus" NOT NULL,
    location text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    "empId" text NOT NULL,
    "userId" integer,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    phone text,
    "departmentId" integer NOT NULL,
    "roleId" integer NOT NULL,
    "managerId" integer,
    "joiningDate" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: eod_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.eod_reports (
    id integer NOT NULL,
    "employeeId" integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    content text NOT NULL,
    "leadsCount" integer DEFAULT 0 NOT NULL,
    "tasksCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: eod_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.eod_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: eod_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.eod_reports_id_seq OWNED BY public.eod_reports.id;


--
-- Name: follow_up_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follow_up_logs (
    id integer NOT NULL,
    "leadId" text NOT NULL,
    "employeeId" integer NOT NULL,
    "scheduledDate" timestamp(3) without time zone NOT NULL,
    "completedDate" timestamp(3) without time zone,
    outcome text,
    "nextAction" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: follow_up_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.follow_up_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: follow_up_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.follow_up_logs_id_seq OWNED BY public.follow_up_logs.id;


--
-- Name: lead_assignment_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lead_assignment_logs (
    id integer NOT NULL,
    "leadId" text NOT NULL,
    "performedById" integer NOT NULL,
    "assignedToId" integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "leadStatus" public."LeadStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: lead_assignment_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lead_assignment_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lead_assignment_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lead_assignment_logs_id_seq OWNED BY public.lead_assignment_logs.id;


--
-- Name: lead_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lead_notes (
    id integer NOT NULL,
    "leadId" text NOT NULL,
    "authorId" integer NOT NULL,
    content text NOT NULL,
    "isPrivate" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: lead_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lead_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lead_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lead_notes_id_seq OWNED BY public.lead_notes.id;


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leads (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    source public."LeadSource" NOT NULL,
    status public."LeadStatus" DEFAULT 'New'::public."LeadStatus" NOT NULL,
    notes text,
    "ownerId" integer,
    "departmentId" integer NOT NULL,
    "lastActivityAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lostReason" text
);


--
-- Name: leave_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_requests (
    id integer NOT NULL,
    "employeeId" integer NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    type public."LeaveType" NOT NULL,
    reason text NOT NULL,
    status public."LeaveStatus" DEFAULT 'Pending'::public."LeaveStatus" NOT NULL,
    "approvedById" integer,
    "managerNote" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: leave_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leave_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leave_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leave_requests_id_seq OWNED BY public.leave_requests.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    module text NOT NULL,
    action text NOT NULL,
    "scopeType" text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    price double precision DEFAULT 0,
    category text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "productManagerId" integer,
    status public."ProductStatus" DEFAULT 'Active'::public."ProductStatus" NOT NULL
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "leadId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "projectManagerId" integer,
    "relationshipManagerId" integer,
    status public."ProjectStatus" DEFAULT 'Active'::public."ProjectStatus" NOT NULL
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    id integer NOT NULL,
    "roleId" integer NOT NULL,
    "permissionId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.role_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.role_permissions_id_seq OWNED BY public.role_permissions.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "departmentId" integer,
    "roleVersion" integer DEFAULT 1 NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "assigneeId" integer,
    "creatorId" integer,
    "dueDate" timestamp(3) without time zone NOT NULL,
    priority text NOT NULL,
    status text NOT NULL,
    "relatedToLeadId" text,
    "projectId" integer,
    "productId" integer,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "completionNote" text
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: eod_reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eod_reports ALTER COLUMN id SET DEFAULT nextval('public.eod_reports_id_seq'::regclass);


--
-- Name: follow_up_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_up_logs ALTER COLUMN id SET DEFAULT nextval('public.follow_up_logs_id_seq'::regclass);


--
-- Name: lead_assignment_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_assignment_logs ALTER COLUMN id SET DEFAULT nextval('public.lead_assignment_logs_id_seq'::regclass);


--
-- Name: lead_notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_notes ALTER COLUMN id SET DEFAULT nextval('public.lead_notes_id_seq'::regclass);


--
-- Name: leave_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests ALTER COLUMN id SET DEFAULT nextval('public.leave_requests_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions ALTER COLUMN id SET DEFAULT nextval('public.role_permissions_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9f377b46-9777-4e26-8c30-ea45a67d083e	34d2581ce663427023d314d6caf8c8ab0e1ab68d201d7a9fc194be7be8681cae	2026-02-24 11:20:29.482119+00	20260207062414_init_phase1	\N	\N	2026-02-24 11:20:27.599819+00	1
3b39cd57-95fe-4d43-b8b1-6d84aa0502bd	839d0ee3013a0ca9551d6a590c0793cfd53c4624bee80a8d3bcfff8378dcdb17	2026-02-24 11:20:32.347178+00	20260209063100_sync_schema	\N	\N	2026-02-24 11:20:30.197493+00	1
bf9407d1-2389-4f9c-8563-fdcbbd8a7e67	8d5a01d9a1b5b05a93125c3ebf2d02a4b2cf0b2ed29a8ca3ca33a14dda5182e0	2026-02-24 11:21:06.194371+00	20260224112102_add_role_version	\N	\N	2026-02-24 11:21:04.195573+00	1
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_logs (id, "employeeId", module, action, "entityId", "entityName", description, metadata, "createdAt") FROM stdin;
131	279	admin	CREATE_DEPARTMENT	42	Sales Department 	New department created: Sales Department 	\N	2026-03-06 10:11:51.785
132	279	admin	CREATE_DEPARTMENT	43	Product Department	New department created: Product Department	\N	2026-03-06 10:12:11.035
133	279	admin	ONBOARD_EMPLOYEE	280	Rashmi  Parmar	New employee onboarded: Rashmi  Parmar (EMP002)	\N	2026-03-06 10:18:43.991
134	279	admin	ONBOARD_EMPLOYEE	281	Kiran  Choudhary	New employee onboarded: Kiran  Choudhary (EMP003)	\N	2026-03-06 10:22:04.961
135	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 7 roles	\N	2026-03-06 10:23:47.638
136	279	admin	ONBOARD_EMPLOYEE	282	Akshat  Parmar	New employee onboarded: Akshat  Parmar (EMP004)	\N	2026-03-06 10:26:31.471
137	279	admin	UPDATE_EMPLOYEE	280	Rashmi  Parmar	Employee profile updated for Rashmi  Parmar	\N	2026-03-06 10:27:18.271
138	279	admin	UPDATE_EMPLOYEE	280	Rashmi  Parmar	Employee profile updated for Rashmi  Parmar	\N	2026-03-06 10:27:18.967
139	279	admin	UPDATE_EMPLOYEE	280	Rashmi  Parmar	Employee profile updated for Rashmi  Parmar	\N	2026-03-06 10:27:19.223
140	279	admin	UPDATE_EMPLOYEE	280	Rashmi  Parmar	Employee profile updated for Rashmi  Parmar	\N	2026-03-06 10:27:19.557
141	279	admin	UPDATE_EMPLOYEE	280	Rashmi  Parmar	Employee profile updated for Rashmi  Parmar	\N	2026-03-06 10:27:19.788
142	279	admin	UPDATE_EMPLOYEE	280	Rashmi  Parmar	Employee profile updated for Rashmi  Parmar	\N	2026-03-06 10:27:20.022
143	279	admin	UPDATE_EMPLOYEE	282	Akshat  Parmar	Employee profile updated for Akshat  Parmar	\N	2026-03-06 10:33:48.899
144	279	admin	UPDATE_EMPLOYEE	282	Akshat  Parmar	Employee profile updated for Akshat  Parmar	\N	2026-03-06 10:33:49.959
145	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 7 roles	\N	2026-03-06 10:36:39.078
146	282	products	CREATE	42	Ai menu system 	New product added to catalog: Ai menu system 	\N	2026-03-06 11:12:12.132
147	282	products	DELETE	42	Ai menu system 	Product removed from catalog: Ai menu system 	\N	2026-03-06 11:12:21.708
148	280	leads	CREATE	cda27d9a-a412-43e9-b17a-dda50d3a4e02	fulchand parmar	New lead created: fulchand parmar	\N	2026-03-06 11:17:56.246
149	280	leads	CREATE	301a9dd9-dfec-4d80-acf1-145b29f63b9d	abc	New lead created: abc	\N	2026-03-06 11:20:20.007
150	280	leads	CREATE	5655d044-025e-4258-bdbe-da9ee828ca38	Farukbhai	New lead created: Farukbhai	\N	2026-03-06 11:21:57.965
151	280	leads	CREATE	7f998dcb-51f1-429b-858c-dbe3c21946b4	Hirenbhai	New lead created: Hirenbhai	\N	2026-03-06 11:22:52.273
152	280	leads	CREATE	0c7753ff-595a-4b80-b6cd-09bfed95156e	Mayank	New lead created: Mayank	\N	2026-03-06 11:24:06.265
153	280	leads	CREATE	26fd08f5-559c-4868-9c93-819bc6060184	abcd	New lead created: abcd	\N	2026-03-06 11:24:58.416
154	280	leads	CREATE	3ae5f0e7-37c7-49a9-9afd-6997396d1472	Sundarraj	New lead created: Sundarraj	\N	2026-03-06 11:25:58.553
155	280	leads	CREATE	56720030-0cd6-4787-bbf9-9e41a36b8583	Mansurali Khan	New lead created: Mansurali Khan	\N	2026-03-06 11:27:30.24
156	280	leads	CREATE	4cbd0069-a31e-4fb9-8615-6e744fc5921b	abec	New lead created: abec	\N	2026-03-06 11:29:02.886
157	280	leads	CREATE	ab28ae72-77e0-4885-a3b9-b4351429dfad	abcde	New lead created: abcde	\N	2026-03-06 11:32:40.84
158	280	leads	CREATE	ecd48d9f-30d4-49f6-b1ab-517c3df489a7	Dilip	New lead created: Dilip	\N	2026-03-06 11:41:25.554
159	280	leads	CREATE	10238c7f-704b-48b5-b112-7d83623b856d	Santosh	New lead created: Santosh	\N	2026-03-06 11:42:34.703
160	280	leads	CREATE	42f62bf2-3fb3-4b83-84fd-12d9a6bd4f97	Rakesh	New lead created: Rakesh	\N	2026-03-06 11:44:05.555
161	280	leads	CREATE	23d93d2e-3616-400d-9166-de2682a8adb2	urvashi	New lead created: urvashi	\N	2026-03-06 11:45:32.606
162	280	leads	CREATE	b4ab6b3a-0895-4036-ab82-24bffc26e214	Sanjay	New lead created: Sanjay	\N	2026-03-06 12:19:50.07
163	280	leads	CREATE	3661581e-7a75-4aa0-a49f-c08933eb4789	Mandeep	New lead created: Mandeep	\N	2026-03-06 12:22:26.874
164	280	leads	CREATE	cedf9e1d-9632-4e9c-832c-0b19a7befd0a	Harsh	New lead created: Harsh	\N	2026-03-06 12:23:40.485
165	280	leads	CREATE	a287f8f8-6363-4816-8dfa-49ac40077afc	Asfa	New lead created: Asfa	\N	2026-03-06 12:29:14.112
166	280	leads	CREATE	1e0536c4-b3cd-4013-b976-f7f36488571e	Madanji	New lead created: Madanji	\N	2026-03-06 12:34:58.235
167	280	leads	CREATE	e14e6557-1606-45e5-b4dd-f27d06d4624c	abcdef	New lead created: abcdef	\N	2026-03-06 12:36:50.657
168	279	admin	CREATE_DEPARTMENT	44	Creative Department 	New department created: Creative Department 	\N	2026-03-06 12:37:26.083
169	279	admin	UPDATE_DEPARTMENT	44	Creative Department 	Department updated: Creative Department 	\N	2026-03-06 12:37:35.864
170	280	leads	CREATE	9e3e8607-dd50-45c9-b57b-b04d38f56eca	xyz	New lead created: xyz	\N	2026-03-06 12:38:25.476
171	279	admin	CREATE_DEPARTMENT	46	Operations Department 	New department created: Operations Department 	\N	2026-03-06 12:42:11.803
172	279	admin	UPDATE_EMPLOYEE	280	Rashmi  Parmar	Employee profile updated for Rashmi  Parmar	\N	2026-03-06 12:43:24.165
173	279	admin	ONBOARD_EMPLOYEE	283	Krishi  Shah	New employee onboarded: Krishi  Shah (EMP005)	\N	2026-03-06 12:44:58.736
174	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 8 roles	\N	2026-03-06 12:49:55.596
175	279	admin	UPDATE_EMPLOYEE	283	Krishi  Shah	Employee profile updated for Krishi  Shah	\N	2026-03-06 12:51:40.324
176	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 9 roles	\N	2026-03-06 12:52:05.702
177	282	products	CREATE	43	Ai document systems	New product added to catalog: Ai document systems	\N	2026-03-06 13:35:57.376
178	279	leads	NOTE_ADDED	cda27d9a-a412-43e9-b17a-dda50d3a4e02	fulchand parmar	New note added to lead: fgghjjxzfgfgfkmjhyzdsfgtghjc,h...	\N	2026-03-06 17:41:16.987
179	279	admin	ONBOARD_EMPLOYEE	284	Alshifa Godil  	New employee onboarded: Alshifa Godil   (EMP006)	\N	2026-03-06 19:21:31.655
180	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 10 roles	\N	2026-03-06 19:26:06.141
181	279	admin	SYNC_PERMISSIONS	145	Operations Manager 	Permissions synced for role: Operations Manager 	\N	2026-03-06 19:27:30.905
182	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 10 roles	\N	2026-03-06 19:27:36.058
183	279	admin	UPDATE_DEPARTMENT	44	Creative Department 	Department updated: Creative Department 	\N	2026-03-06 19:30:04.316
184	279	admin	ONBOARD_EMPLOYEE	285	Danish  Parmar 	New employee onboarded: Danish  Parmar  (EMP007)	\N	2026-03-06 20:39:10.5
185	279	admin	ONBOARD_EMPLOYEE	286	Alfaz Bilakhiya	New employee onboarded: Alfaz Bilakhiya (EMP008)	\N	2026-03-06 20:45:28.871
186	279	admin	ONBOARD_EMPLOYEE	287	Dhanashree  Trambadiya	New employee onboarded: Dhanashree  Trambadiya (EMP009)	\N	2026-03-06 20:56:25.397
187	279	admin	ONBOARD_EMPLOYEE	288	Darshraj A	New employee onboarded: Darshraj A (EMP010)	\N	2026-03-06 21:00:45.552
188	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 13 roles	\N	2026-03-06 21:07:03.671
189	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 13 roles	\N	2026-03-06 21:07:22.596
190	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 13 roles	\N	2026-03-06 21:21:58.814
191	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 13 roles	\N	2026-03-06 21:23:29.324
192	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 14 roles	\N	2026-03-06 21:26:38.996
193	279	products	CREATE	44	AI Menu System 	New product added to catalog: AI Menu System 	\N	2026-03-06 21:30:06.258
194	279	admin	ONBOARD_EMPLOYEE	289	Bhargav Gohel 	New employee onboarded: Bhargav Gohel  (EMP011)	\N	2026-03-06 21:31:32.946
195	279	admin	UPDATE_EMPLOYEE	289	Bhargav Gohel 	Employee profile updated for Bhargav Gohel 	\N	2026-03-06 21:31:52.601
196	279	admin	UPDATE_EMPLOYEE	289	Bhargav Gohel 	Employee profile updated for Bhargav Gohel 	\N	2026-03-06 21:31:52.833
197	279	products	UPDATE	44	AI Menu System 	Product information updated for AI Menu System 	\N	2026-03-06 21:32:10.385
198	280	products	TASK_CREATE	44	Client work update	Task created: Client work update	\N	2026-03-07 06:00:02.793
199	280	leads	CREATE	2f6b3684-f867-4a7f-8685-fd9cce6d2865	Yunusbhai	New lead created: Yunusbhai	\N	2026-03-07 06:03:23.306
200	280	leads	CREATE	02449459-324a-441a-8445-70661e61409b	user	New lead created: user	\N	2026-03-07 06:20:35.603
201	281	leads	CREATE	036983a6-a489-4c44-aac7-3365f47c8422	Neel Patel	New lead created: Neel Patel	\N	2026-03-07 06:51:42.282
202	279	admin	UPDATE_EMPLOYEE	282	Akshat  Parmar	Employee profile updated for Akshat  Parmar	\N	2026-03-07 10:12:27.532
203	280	leads	CREATE	4bbc0d39-8912-48f4-ab02-4d8dd52fc0cb	user1	New lead created: user1	\N	2026-03-07 10:40:36.146
204	280	leads	CREATE	5ccda9a9-2f24-4989-a626-7b8e6921d3c3	PD gohil	New lead created: PD gohil	\N	2026-03-07 10:42:14.224
205	280	leads	CREATE	692b56f3-1293-41ba-951b-10229ae4ecdc	Ghanshyam thakkar	New lead created: Ghanshyam thakkar	\N	2026-03-07 10:43:17.307
206	280	leads	CREATE	e7d8ee5f-fd1d-4912-87be-727184021b76	user2	New lead created: user2	\N	2026-03-07 10:45:05.007
207	280	leads	CREATE	212482c6-58bf-4f50-a9ab-9dbd3024d864	DR Rana	New lead created: DR Rana	\N	2026-03-07 10:46:15.519
208	280	leads	CREATE	b3f97cb7-caa2-4069-8c17-c11e1d37fa09	Himanshubhai	New lead created: Himanshubhai	\N	2026-03-07 10:48:32.136
209	280	leads	CREATE	34044465-3dff-4796-ad30-d1b6f4632212	Ashok 	New lead created: Ashok 	\N	2026-03-07 10:50:05.804
210	280	leads	CREATE	f4841590-5480-4548-8376-64885d36fc45	Ajitbhai Owner	New lead created: Ajitbhai Owner	\N	2026-03-07 10:51:19.299
211	280	leads	CREATE	e58e56d0-3b21-4ce2-bfc6-7d5df90f317b	Ashwin	New lead created: Ashwin	\N	2026-03-07 11:00:46.928
212	280	leads	CREATE	9187cc43-0466-4742-9a00-057740e408ff	Tejas	New lead created: Tejas	\N	2026-03-07 11:02:00.599
213	280	leads	CREATE	ab92311a-aaa6-4fa5-b0e0-331e2d0dc3da	Savant gandhi	New lead created: Savant gandhi	\N	2026-03-07 11:03:09.506
214	280	leads	CREATE	113ed40a-72ad-46e9-a7a1-33582b58a63f	Kishor	New lead created: Kishor	\N	2026-03-07 11:04:38.849
215	280	leads	CREATE	afe3aaa7-665d-4045-8d4d-5833de062eb5	Kirtibhai Dave	New lead created: Kirtibhai Dave	\N	2026-03-07 11:05:44.02
216	280	leads	CREATE	133b89c7-f264-4a87-bc01-20ddc9422cb3	Shreefal	New lead created: Shreefal	\N	2026-03-07 11:06:49.211
217	280	leads	CREATE	a756a63c-bac1-49c7-86be-bf098e7acfcf	Tushar	New lead created: Tushar	\N	2026-03-07 11:07:49.958
218	280	leads	CREATE	3586c275-cc58-45db-aad7-5338612f729a	user3	New lead created: user3	\N	2026-03-07 11:09:55.075
219	280	leads	CREATE	c1adad2b-349e-4c1f-aefb-97d00d93dd09	user5	New lead created: user5	\N	2026-03-07 11:11:26.816
220	280	leads	CREATE	a70c6bd7-9c43-4a04-964e-f54d0cc96367	Jaypal	New lead created: Jaypal	\N	2026-03-07 11:13:16.632
221	280	leads	CREATE	b5f87d1e-2959-46c2-8cc4-b714d10d89af	Trupti(Manager)	New lead created: Trupti(Manager)	\N	2026-03-07 11:14:26.426
222	280	leads	CREATE	38bf99d9-c339-4694-b787-f39e323478d0	user6	New lead created: user6	\N	2026-03-07 11:15:29.462
223	280	leads	CREATE	54025528-426a-4cc6-847d-0a7b106b6f19	Mihir(Receptionist)	New lead created: Mihir(Receptionist)	\N	2026-03-07 11:18:44.41
224	280	leads	CREATE	84d0bc67-a962-46c8-bb3f-8ca369478381	Janvi rathod 	New lead created: Janvi rathod 	\N	2026-03-07 11:20:02.803
225	280	leads	CREATE	3aec438b-7449-4e79-a44e-70efb275bef2	Surpalsinh	New lead created: Surpalsinh	\N	2026-03-07 11:21:10.54
226	280	leads	CREATE	c7fbfccf-7680-4c22-b909-ce7c051dcdb4	Padma Tiwari	New lead created: Padma Tiwari	\N	2026-03-07 11:22:49.723
227	280	leads	CREATE	844c6ebf-6389-4b0c-b885-78b3b4fd7ac6	Umangbhai	New lead created: Umangbhai	\N	2026-03-07 11:25:19.795
228	280	leads	CREATE	1866dde1-b511-4fb0-aa71-9a003ea4c69e	user6	New lead created: user6	\N	2026-03-07 11:27:00.706
229	280	leads	CREATE	7a2e4698-2bd1-426c-90f2-99783ec43250	user7	New lead created: user7	\N	2026-03-07 11:40:12.446
230	280	leads	CREATE	cf68f900-7fd2-4c80-b084-ce1a4c2fe62d	user8	New lead created: user8	\N	2026-03-07 11:41:16.317
231	280	leads	CREATE	5b7fe089-c1d5-408a-aa21-36e52b321e4c	Ajaysinh	New lead created: Ajaysinh	\N	2026-03-07 11:42:09.99
232	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 14 roles	\N	2026-03-08 11:42:42.071
233	279	admin	ONBOARD_EMPLOYEE	291	Shubham Raj 	New employee onboarded: Shubham Raj  (EMP012)	\N	2026-03-08 11:45:11.752
234	279	admin	ONBOARD_EMPLOYEE	292	Aneri Dadhaniya 	New employee onboarded: Aneri Dadhaniya  (EMP013)	\N	2026-03-08 11:48:32.328
235	279	admin	ONBOARD_EMPLOYEE	293	Manisha  Tejvani	New employee onboarded: Manisha  Tejvani (EMP014)	\N	2026-03-08 11:49:11.435
236	279	admin	ONBOARD_EMPLOYEE	294	Shreya  Uttam	New employee onboarded: Shreya  Uttam (EMP015)	\N	2026-03-08 11:49:41.271
237	279	admin	ONBOARD_EMPLOYEE	295	Dhanashri  Kadam	New employee onboarded: Dhanashri  Kadam (EMP016)	\N	2026-03-08 11:50:16.168
238	279	admin	ONBOARD_EMPLOYEE	296	Ravi  parmar	New employee onboarded: Ravi  parmar (EMP017)	\N	2026-03-08 11:51:38.089
239	279	admin	ONBOARD_EMPLOYEE	297	Hanshika M	New employee onboarded: Hanshika M (EMP018)	\N	2026-03-08 11:52:35.939
240	279	admin	CREATE_DEPARTMENT	47	Project	New department created: Project	\N	2026-03-08 11:53:38.761
241	279	admin	UPDATE_DEPARTMENT	47	Project Department	Department updated: Project Department	\N	2026-03-08 11:54:29.359
242	279	admin	ONBOARD_EMPLOYEE	298	Tanu  Jaiswal 	New employee onboarded: Tanu  Jaiswal  (EMP019)	\N	2026-03-08 11:57:45.139
243	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 20 roles	\N	2026-03-08 12:06:38.382
244	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 20 roles	\N	2026-03-08 12:08:43.465
245	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 20 roles	\N	2026-03-08 12:10:17.576
246	279	admin	UPDATE_EMPLOYEE	282	Akshat  Parmar	Employee profile updated for Akshat  Parmar	\N	2026-03-08 12:14:43.043
247	279	admin	UPDATE_EMPLOYEE	282	Akshat  Parmar	Employee profile updated for Akshat  Parmar	\N	2026-03-08 12:15:47.912
248	279	admin	UPDATE_EMPLOYEE	297	Hanshika Singh	Employee profile updated for Hanshika Singh	\N	2026-03-09 08:44:54.929
249	279	admin	UPDATE_EMPLOYEE	294	Shreya  Khedkar	Employee profile updated for Shreya  Khedkar	\N	2026-03-09 08:46:45.578
250	279	admin	ONBOARD_EMPLOYEE	299	test  user	New employee onboarded: test  user (EMP020)	\N	2026-03-09 10:56:39.925
251	286	tasks	STATUS_CHANGE	23a06fc0-756c-4fcf-9802-9cd3b3ea3da9	Usus	Task status changed from Pending to Completed	{"newStatus": "Completed", "oldStatus": "Pending", "completionNote": "Suushsususuus"}	2026-03-10 07:01:15.466
252	286	tasks	STATUS_CHANGE	23a06fc0-756c-4fcf-9802-9cd3b3ea3da9	Usus	Task status changed from Completed to Pending	{"newStatus": "Pending", "oldStatus": "Completed", "completionNote": null}	2026-03-10 07:01:24.917
253	279	products	TASK_CREATE	44	Development 	Task created: Development 	\N	2026-03-10 07:08:09.452
254	286	tasks	STATUS_CHANGE	6a0c658e-ebb1-455d-9a96-0d48cc38e9f2	Development 	Task status changed from Pending to Completed	{"newStatus": "Completed", "oldStatus": "Pending", "completionNote": "Testing ok"}	2026-03-10 07:11:13.207
255	286	tasks	STATUS_CHANGE	6a0c658e-ebb1-455d-9a96-0d48cc38e9f2	Development 	Task status changed from Completed to Pending	{"newStatus": "Pending", "oldStatus": "Completed", "completionNote": null}	2026-03-10 07:12:22.959
256	286	tasks	STATUS_CHANGE	6a0c658e-ebb1-455d-9a96-0d48cc38e9f2	Development 	Task status changed from Pending to Completed	{"newStatus": "Completed", "oldStatus": "Pending", "completionNote": "Ok testing "}	2026-03-10 07:12:46.403
257	286	tasks	STATUS_CHANGE	23a06fc0-756c-4fcf-9802-9cd3b3ea3da9	Usus	Task status changed from Pending to In Progress	{"newStatus": "In Progress", "oldStatus": "Pending"}	2026-03-10 07:13:13.758
258	286	tasks	STATUS_CHANGE	6a0c658e-ebb1-455d-9a96-0d48cc38e9f2	Development 	Task status changed from Completed to In Progress	{"newStatus": "In Progress", "oldStatus": "Completed", "completionNote": null}	2026-03-10 07:13:52.092
259	279	tasks	DELETE	6a0c658e-ebb1-455d-9a96-0d48cc38e9f2	Development 	Task deleted: Development 	\N	2026-03-10 07:39:03.222
260	279	admin	BATCH_SYNC_PERMISSIONS	SYSTEM	Permission Matrix	Bulk permission update performed for 20 roles	\N	2026-03-12 05:59:51.07
261	279	products	CREATE	45	CRM System	New product added to catalog: CRM System	\N	2026-03-12 06:01:04.899
262	279	products	TASK_CREATE	45	Changes and issue resolve	Task created: Changes and issue resolve	\N	2026-03-12 06:04:25.669
\.


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attendance (id, "employeeId", date, "checkIn", "checkOut", status, location, notes, "createdAt", "updatedAt") FROM stdin;
1827	282	2026-03-06 00:00:00	2026-03-06 11:18:50.993	\N	Present	\N	\N	2026-03-06 11:18:50.993	2026-03-06 11:18:50.993
1828	280	2026-03-07 00:00:00	2026-03-07 05:38:56.999	2026-03-07 12:32:37.684	Present	\N	\N	2026-03-07 05:38:56.999	2026-03-07 12:32:37.686
1829	281	2026-03-07 00:00:00	2026-03-07 06:20:16.409	2026-03-07 13:16:10.441	Present	\N	\N	2026-03-07 06:20:16.409	2026-03-07 13:16:10.442
1834	286	2026-03-09 00:00:00	2026-03-09 07:02:55.769	2026-03-09 07:03:00.331	Present	\N	\N	2026-03-09 07:02:55.769	2026-03-09 07:03:00.332
1835	288	2026-03-09 00:00:00	2026-03-09 07:05:35.02	\N	Present	\N	\N	2026-03-09 07:05:35.02	2026-03-09 07:05:35.02
1839	283	2026-03-09 00:00:00	2026-03-09 09:42:12.527	\N	Present	\N	\N	2026-03-09 09:42:12.527	2026-03-09 09:42:12.527
1831	291	2026-03-09 00:00:00	2026-03-09 04:38:36.268	2026-03-09 10:56:48.097	Present	\N	\N	2026-03-09 04:38:36.268	2026-03-09 10:56:48.098
1830	280	2026-03-09 00:00:00	2026-03-09 04:28:49.906	2026-03-09 12:34:21.888	Present	\N	\N	2026-03-09 04:28:49.906	2026-03-09 12:34:21.89
1836	297	2026-03-09 00:00:00	2026-03-09 07:17:12.17	2026-03-09 12:46:06.334	Present	\N	\N	2026-03-09 07:17:12.17	2026-03-09 12:46:06.335
1838	285	2026-03-09 00:00:00	2026-03-09 09:09:45.74	2026-03-09 13:06:01.455	Present	\N	\N	2026-03-09 09:09:45.74	2026-03-09 13:06:01.456
1832	281	2026-03-09 00:00:00	2026-03-09 04:52:55.955	2026-03-09 13:28:36.998	Present	\N	\N	2026-03-09 04:52:55.955	2026-03-09 13:28:37
1833	287	2026-03-09 00:00:00	2026-03-09 07:02:49.44	2026-03-09 14:01:32.422	Present	\N	\N	2026-03-09 07:02:49.44	2026-03-09 14:01:32.423
1840	289	2026-03-09 00:00:00	2026-03-09 16:13:35.232	\N	Present	\N	\N	2026-03-09 16:13:35.232	2026-03-09 16:13:35.232
1837	293	2026-03-09 00:00:00	2026-03-09 07:17:41.361	2026-03-09 17:30:16.179	Present	\N	\N	2026-03-09 07:17:41.361	2026-03-09 17:30:16.18
1846	286	2026-03-10 00:00:00	2026-03-10 07:02:33.157	\N	Present	\N	\N	2026-03-10 07:02:33.157	2026-03-10 07:02:33.157
1849	293	2026-03-10 00:00:00	2026-03-10 10:27:11.873	\N	Present	\N	\N	2026-03-10 10:27:11.873	2026-03-10 10:27:11.873
1842	280	2026-03-10 00:00:00	2026-03-10 04:42:10.855	2026-03-10 10:53:50.47	Present	\N	\N	2026-03-10 04:42:10.855	2026-03-10 10:53:50.472
1847	284	2026-03-10 00:00:00	2026-03-10 07:34:28.199	2026-03-10 11:03:12.409	Present	\N	\N	2026-03-10 07:34:28.199	2026-03-10 11:03:12.41
1845	291	2026-03-10 00:00:00	2026-03-10 06:27:44.175	2026-03-10 12:35:11.151	Present	\N	\N	2026-03-10 06:27:44.175	2026-03-10 12:35:11.152
1848	285	2026-03-10 00:00:00	2026-03-10 08:41:05.223	2026-03-10 13:02:10.357	Present	\N	\N	2026-03-10 08:41:05.223	2026-03-10 13:02:10.358
1844	297	2026-03-10 00:00:00	2026-03-10 05:39:01.438	2026-03-10 13:15:05.79	Present	\N	\N	2026-03-10 05:39:01.438	2026-03-10 13:15:05.791
1843	281	2026-03-10 00:00:00	2026-03-10 04:52:24.687	2026-03-10 13:17:06.313	Present	\N	\N	2026-03-10 04:52:24.687	2026-03-10 13:17:06.314
1841	287	2026-03-10 00:00:00	2026-03-10 03:42:14.811	2026-03-10 14:51:26.381	Present	\N	\N	2026-03-10 03:42:14.811	2026-03-10 14:51:26.382
1854	284	2026-03-11 00:00:00	2026-03-11 06:35:13.05	2026-03-11 11:57:41.651	Present	\N	\N	2026-03-11 06:35:13.05	2026-03-11 11:57:41.652
1855	280	2026-03-11 00:00:00	2026-03-11 08:56:06.181	2026-03-11 12:38:05.086	Present	\N	\N	2026-03-11 08:56:06.181	2026-03-11 12:38:05.087
1852	297	2026-03-11 00:00:00	2026-03-11 05:41:12.092	2026-03-11 13:01:08.124	Present	\N	\N	2026-03-11 05:41:12.092	2026-03-11 13:01:08.125
1850	287	2026-03-11 00:00:00	2026-03-11 04:23:27.366	2026-03-11 13:09:55.706	Present	\N	\N	2026-03-11 04:23:27.366	2026-03-11 13:09:55.707
1853	291	2026-03-11 00:00:00	2026-03-11 06:29:11.89	2026-03-11 13:16:36.713	Present	\N	\N	2026-03-11 06:29:11.89	2026-03-11 13:16:36.714
1851	281	2026-03-11 00:00:00	2026-03-11 04:58:04.333	2026-03-11 13:51:18.133	Present	\N	\N	2026-03-11 04:58:04.333	2026-03-11 13:51:18.134
1856	287	2026-03-12 00:00:00	2026-03-12 04:50:36.176	\N	Present	\N	\N	2026-03-12 04:50:36.176	2026-03-12 04:50:36.176
1857	280	2026-03-12 00:00:00	2026-03-12 04:55:29.25	\N	Present	\N	\N	2026-03-12 04:55:29.25	2026-03-12 04:55:29.25
1858	281	2026-03-12 00:00:00	2026-03-12 05:38:55.709	\N	Present	\N	\N	2026-03-12 05:38:55.709	2026-03-12 05:38:55.709
1859	297	2026-03-12 00:00:00	2026-03-12 06:48:52.369	\N	Present	\N	\N	2026-03-12 06:48:52.369	2026-03-12 06:48:52.369
1860	291	2026-03-12 00:00:00	2026-03-12 06:50:48.813	\N	Present	\N	\N	2026-03-12 06:50:48.813	2026-03-12 06:50:48.813
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.departments (id, name, code, description, "isActive", "createdAt", "updatedAt") FROM stdin;
41	Administration	ADMIN	Central Management	t	2026-03-06 09:00:12.298	2026-03-06 09:00:12.298
42	Sales Department 	SALES		t	2026-03-06 10:11:51.512	2026-03-06 10:11:51.512
43	Product Department	Product		t	2026-03-06 10:12:10.864	2026-03-06 10:12:10.864
46	Operations Department 	OPS		t	2026-03-06 12:42:11.644	2026-03-06 12:42:11.644
44	Creative Department 	CREARTIVE 	Creative handles everything visual that represents the company.\n\nThat includes:\n\nBrand visuals\n\nMarketing creatives\n\nProduct UI/UX\n\nProject UI/UX\n\nDesign consistency across everything people see\n	t	2026-03-06 12:37:25.908	2026-03-06 19:30:04.142
47	Project Department	PORJECT		t	2026-03-08 11:53:38.108	2026-03-08 11:54:29.19
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employees (id, "empId", "userId", "firstName", "lastName", email, phone, "departmentId", "roleId", "managerId", "joiningDate", "isActive", "createdAt", "updatedAt") FROM stdin;
285	EMP007	285	Danish 	Parmar 	danish@gmail.com		44	148	283	\N	t	2026-03-06 20:39:10.229	2026-03-06 20:39:10.229
286	EMP008	286	Alfaz	Bilakhiya	alfazb@gmail.com		43	151	\N	\N	t	2026-03-06 20:45:28.597	2026-03-06 20:45:28.597
287	EMP009	287	Dhanashree 	Trambadiya	dhanashreeT@gmail.com		43	151	\N	\N	t	2026-03-06 20:56:25.123	2026-03-06 20:56:25.123
288	EMP010	288	Darshraj	A	darshraj@gmail.com		42	139	281	\N	t	2026-03-06 21:00:45.32	2026-03-06 21:00:45.32
289	EMP011	289	Bhargav	Gohel 	bhargavmg@gmail.com		43	150	\N	\N	t	2026-03-06 21:31:32.705	2026-03-06 21:31:52.218
291	EMP012	290	Shubham	Raj 	shubham748856@gmail.com		43	153	289	\N	t	2026-03-08 11:45:11.508	2026-03-08 11:45:11.508
292	EMP013	291	Aneri	Dadhaniya 	dadhaniyaaneri@gmail.com		44	154	283	\N	t	2026-03-08 11:48:32.095	2026-03-08 11:48:32.095
293	EMP014	292	Manisha 	Tejvani	manishatejvani26@gmail.com		44	154	283	\N	t	2026-03-08 11:49:11.198	2026-03-08 11:49:11.198
295	EMP016	294	Dhanashri 	Kadam	dhanashri.k0409@gmail.com		44	154	283	\N	t	2026-03-08 11:50:15.929	2026-03-08 11:50:15.929
296	EMP017	295	Ravi 	parmar	raviparmar11102001@gmail.com		41	158	282	\N	t	2026-03-08 11:51:37.918	2026-03-08 11:51:37.918
298	EMP019	297	Tanu 	Jaiswal 	jaiswaltanu1705@gmail.com		47	161	\N	\N	t	2026-03-08 11:57:44.899	2026-03-08 11:57:44.899
282	EMP004	282	Akshat 	Parmar	parmarakshat23@gmail.com		41	137	279	\N	t	2026-03-06 10:26:31.213	2026-03-08 12:15:47.518
297	EMP018	296	Hanshika	Singh	hanshika12004@gmail.com		44	154	283	\N	t	2026-03-08 11:52:35.622	2026-03-09 08:44:54.532
294	EMP015	293	Shreya 	Khedkar	shreyakhedkar06@gmail.com		44	154	283	\N	t	2026-03-08 11:49:41.114	2026-03-09 08:46:45.191
299	EMP020	298	test 	user	testuser@gmail.com		44	148	283	\N	t	2026-03-09 10:56:39.663	2026-03-09 10:56:39.663
279	EMP001	279	Mediaa	Masala	mediaamasala@gmail.com	\N	41	137	\N	\N	t	2026-03-06 09:00:19.871	2026-03-06 09:00:19.871
281	EMP003	281	Kiran 	Choudhary	kiranchoudhary5931@gmail.com		42	143	\N	\N	t	2026-03-06 10:22:04.708	2026-03-06 10:22:04.708
280	EMP002	280	Rashmi 	Parmar	rpdesigner36@gmail.com		46	145	\N	\N	t	2026-03-06 10:18:43.733	2026-03-06 12:43:23.774
283	EMP005	283	Krishi 	Shah	krishishah@gmail.com		44	147	\N	\N	t	2026-03-06 12:44:58.501	2026-03-06 12:51:39.928
284	EMP006	284	Alshifa	Godil  	shifagodil07@gmail.com		44	148	283	\N	t	2026-03-06 19:21:31.411	2026-03-06 19:21:31.411
\.


--
-- Data for Name: eod_reports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.eod_reports (id, "employeeId", date, content, "leadsCount", "tasksCount", "createdAt", "updatedAt") FROM stdin;
389	280	2026-03-07 05:54:17.822	Certificate: internship completion\nAI tool description (Internship +Training)	0	3	2026-03-07 05:54:17.826	2026-03-07 05:54:17.826
390	280	2026-03-07 13:28:26.972	Post Design for internship\nibhavnagar payment-1300 with advertisement \nLeads upload in CRM\nHotel management software	0	4	2026-03-07 13:28:26.973	2026-03-07 13:28:26.973
\.


--
-- Data for Name: follow_up_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.follow_up_logs (id, "leadId", "employeeId", "scheduledDate", "completedDate", outcome, "nextAction", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: lead_assignment_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lead_assignment_logs (id, "leadId", "performedById", "assignedToId", date, "leadStatus", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: lead_notes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lead_notes (id, "leadId", "authorId", content, "isPrivate", "createdAt", "updatedAt") FROM stdin;
102	cda27d9a-a412-43e9-b17a-dda50d3a4e02	279	fgghjjxzfgfgfkmjhyzdsfgtghjc,hjhydertfbh	f	2026-03-06 17:41:16.337	2026-03-06 17:41:16.337
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leads (id, name, email, phone, company, source, status, notes, "ownerId", "departmentId", "lastActivityAt", "createdAt", "updatedAt", "lostReason") FROM stdin;
cda27d9a-a412-43e9-b17a-dda50d3a4e02	fulchand parmar	testu1@gmail.com	9638550005	the fortune cafe restaurant	Cold_Call	New	9638550005- fulchand parmar owner\n9714006565- jitendrasinh cashier\nBanaskatha- the fortune cafe restaurant\nThey want demo online through Any desk	280	42	\N	2026-03-06 11:17:56.06	2026-03-06 11:17:56.06	\N
301a9dd9-dfec-4d80-acf1-145b29f63b9d	abc	testu2@gmail.com	9924697608	SAHYOG SAGAR RESTAURANT\t	Cold_Call	New	call back+interested+details wp\t	280	42	\N	2026-03-06 11:20:19.849	2026-03-06 11:20:19.849	\N
5655d044-025e-4258-bdbe-da9ee828ca38	Farukbhai	test3@gmail.com	8980001930	SORATH MAHAL RESTAURANT\t	Cold_Call	New	6.SORATH MAHAL RESTAURANT\t\nfarukhbhai no need but detail wp\t\n8980001930\nhttps://maps.app.goo.gl/pTRq5KgtzUZiN8fQ6\n	280	42	\N	2026-03-06 11:21:57.802	2026-03-06 11:21:57.802	\N
7f998dcb-51f1-429b-858c-dbe3c21946b4	Hirenbhai	test4@gmail.com	8866680907	Shivam Restaurant\t	Cold_Call	New	5.Shivam Restaurant\t\n8866680907-wp-hirenbhai(virenbhai owner)+ Interested+ Want details\t9099902233\t\nhttps://maps.app.goo.gl/xiYGBQWMsJaYi7Gu8\thttps://www.instagram.com/shivam_restaurante?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==\n	280	42	\N	2026-03-06 11:22:52.191	2026-03-06 11:22:52.191	\N
0c7753ff-595a-4b80-b6cd-09bfed95156e	Mayank	test5@gail.com	7096702676	Madhav Hotel\t	Cold_Call	New	Madhav Hotel\t\nmayank- Call 5 today to talk with owner or wp details\t\n7096702676\t\nhttps://maps.app.goo.gl/bXPDzad43LX1G8gm9\n	280	42	\N	2026-03-06 11:24:06.094	2026-03-06 11:24:06.094	\N
26fd08f5-559c-4868-9c93-819bc6060184	abcd	test6@gmail.com	7926574892	Pleasure Trove	Cold_Call	New	Pleasure Trove\t\nwant details+ owner not available\t\n7926574892\nhttps://share.google/ujziUwgMnBSVJT9E1\t	280	42	\N	2026-03-06 11:24:58.33	2026-03-06 11:24:58.33	\N
3ae5f0e7-37c7-49a9-9afd-6997396d1472	Sundarraj	test7@gmail.com	8238385888	Raghav Restaurant & Banquet\t	Cold_Call	New	2.Raghav Restaurant & Banquet\t\nSundarraj+interested+want details\t\n8238385888\nhttps://share.google/7V71xvOvSqivSciuO\n	280	42	\N	2026-03-06 11:25:58.471	2026-03-06 11:25:58.471	\N
56720030-0cd6-4787-bbf9-9e41a36b8583	Mansurali Khan	test8@gmail.com	9924811440	Shaahana Restaurant & Banquet\t	Cold_Call	New	1.Shaahana Restaurant & Banquet\t\nMansurali Khan-Interested+want details \t\n9924811440\nhttps://share.google/pKeR7NSOjTcDrenxt\n	280	42	\N	2026-03-06 11:27:30.081	2026-03-06 11:27:30.081	\N
4cbd0069-a31e-4fb9-8615-6e744fc5921b	abec	test9@gmail.com	070163 10619	Virasat-E-Curry Panjrapole	Cold_Call	New	Virasat-E-Curry Panjrapole | Vegetarian North Indian & Punjabi Restaurant in Ahmedabad\n070163 10619\nhttps://share.google/LvezFgrPd5fgFRj1K\nBusy	280	42	\N	2026-03-06 11:29:02.806	2026-03-06 11:29:02.806	\N
ab28ae72-77e0-4885-a3b9-b4351429dfad	abcde	test10@gmail.com	07926408200	Jungle Bhookh Restaurant	Cold_Call	New	Jungle Bhookh Restaurant\n07926408200\nhttps://share.google/74D56r1glvwh4srDe\nDeny but details wp	280	42	\N	2026-03-06 11:32:40.673	2026-03-06 11:32:40.673	\N
ecd48d9f-30d4-49f6-b1ab-517c3df489a7	Dilip	test11@gmail.com	9145586777	King’s Kraft Tremezzo Inn\t	Cold_Call	New	8.King’s Kraft Tremezzo Inn\t\ndilip-Interested+demo\t\n9145586777\nhttps://maps.app.goo.gl/DvRF7XUhYDCmQGs56\nhttps://www.kingskraft.com/hotel/king-s-kraft-tremezzo-inn	280	42	\N	2026-03-06 11:41:25.378	2026-03-06 11:41:25.378	\N
10238c7f-704b-48b5-b112-7d83623b856d	Santosh	test12@gmail.com	9904468855	The Grand Astoria Somnath\t	Cold_Call	New	7.The Grand Astoria Somnath\t\nsantosh+interested+want details\t\n9904468855\nhttps://maps.app.goo.gl/KyBLbVocJGVUVspC7\n	280	42	\N	2026-03-06 11:42:34.624	2026-03-06 11:42:34.624	\N
42f62bf2-3fb3-4b83-84fd-12d9a6bd4f97	Rakesh	test13@gmail.com	9327794688	Hotel Satkar Veraval Somnath\t	Cold_Call	New	Hotel Satkar Veraval Somnath\t-2876220120\t\nmanager Rakesh number given+Interested+want details\thttps://maps.app.goo.gl/yoobDVYYECDxJwo78\nhttp://www.satkarhotel.in/\t\nRakesh-9327794688	280	42	\N	2026-03-06 11:44:05.472	2026-03-06 11:44:05.472	\N
23d93d2e-3616-400d-9166-de2682a8adb2	urvashi	test14@gmail.com	9033067168	Ekansh Hotels And Resorts	Cold_Call	New	Ekansh Hotels And Resorts-9033067168\nurvashi-purchse manager not available+want details\nhttps://maps.app.goo.gl/FAMri5szKwmukCLt9\t\nhttps://www.ekanshhotelsandresorts.com/	280	42	\N	2026-03-06 11:45:32.528	2026-03-06 11:45:32.528	\N
b4ab6b3a-0895-4036-ab82-24bffc26e214	Sanjay	test15@gmail.com	7202822111	Hotel Shlok Inn	Cold_Call	New	Hotel Shlok Inn\nSanjay(Restaurant in Past)+Interested+want details\n7202822111\t\nhttps://maps.app.goo.gl/3ZDbe7AqHdNnwu9d8\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n	280	42	\N	2026-03-06 12:19:49.893	2026-03-06 12:19:49.893	\N
3661581e-7a75-4aa0-a49f-c08933eb4789	Mandeep	test16@gmail.com	9909801774	Hotel The Grand Daksh Mansingh Inn Somnath	Cold_Call	New	Hotel The Grand Daksh Mansingh Inn Somnath\tMandeep(detais WP)\t\n9909801774\t\nhttps://maps.app.goo.gl/PT8bUFkJQUqnsVcG8\nhttp://www.thegranddaksh.com/\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t	280	42	\N	2026-03-06 12:22:26.706	2026-03-06 12:22:26.706	\N
cedf9e1d-9632-4e9c-832c-0b19a7befd0a	Harsh	test17@gmail.com	7359966000	Hotel Sunshine inn Somnath\t	Cold_Call	New	2.Hotel Sunshine inn Somnath\t\nHarsh(want details)\t\n7359966000\nhttps://maps.app.goo.gl/obc1hx6Lu7nbyjvp6\nhttps://www.hotelsunshineinn.com/	280	42	\N	2026-03-06 12:23:40.401	2026-03-06 12:23:40.401	\N
a287f8f8-6363-4816-8dfa-49ac40077afc	Asfa	test18@gmail.com	9054505466	Hotel Scintilla\t	Cold_Call	New	Hotel Scintilla\t\nafsa (details wp) Good \t\n9054505466\nhttps://maps.app.goo.gl/Vpfv8WspytPK4bKb9	280	42	\N	2026-03-06 12:29:13.952	2026-03-06 12:29:13.952	\N
1e0536c4-b3cd-4013-b976-f7f36488571e	Madanji	test19@gmail.com	070460 35079	Aagrah Restaurant	Cold_Call	New	Aagrah Restaurant\nPhone: 070460 35079\nhttps://share.google/7iYKqLn4J5FGhFOl6\nInterested+want details\nMadanji	280	42	\N	2026-03-06 12:34:58.078	2026-03-06 12:34:58.078	\N
e14e6557-1606-45e5-b4dd-f27d06d4624c	abcdef	test20@gmail.com	89805 73415	Brewers coffe bar	Cold_Call	New	+91 89805 73415\nbrewers coffe bar- Bhavnagar\nMeeting Tomorrow\nneed product activation 7 day trial	280	42	\N	2026-03-06 12:36:50.577	2026-03-06 12:36:50.577	\N
9e3e8607-dd50-45c9-b57b-b04d38f56eca	xyz	test21@gmail.com	8140814377	Rotli multicuiine restaurant	Cold_Call	New	+91 81408 14377\nRotli multicuiine restaurant\nwant demo 7 days free trial today\nRajkot	280	42	\N	2026-03-06 12:38:25.317	2026-03-06 12:38:25.317	\N
2f6b3684-f867-4a7f-8685-fd9cce6d2865	Yunusbhai	test22@gmail.com	9904020612	Bharosa Fast food	Cold_Call	New	Meeting: Dashraj\nDeal done 	280	46	\N	2026-03-07 06:03:23.137	2026-03-07 06:03:23.137	\N
02449459-324a-441a-8445-70661e61409b	user	test23@gmail.com	08140825825	Lil' Heaven	Cold_Call	New	Meeting: Kiran ma'am\nClient done \nAi menu system	280	46	\N	2026-03-07 06:20:35.436	2026-03-07 06:20:35.436	\N
036983a6-a489-4c44-aac7-3365f47c8422	Neel Patel	kiranchoudhary5931@gmail.com	+91 95582 21390	Jor Shor Restaurant and Banquet	Cold_Call	New	Cb for re-schedule meeting	281	42	\N	2026-03-07 06:51:42.098	2026-03-07 06:51:42.098	\N
4bbc0d39-8912-48f4-ab02-4d8dd52fc0cb	user1	test24@gmail.com	7046560560	Brick Kitchen	Cold_Call	New	Brick Kitchen\n7046560560\nhttps://share.google/EHOOyIDwB8QrWNnBj\nDeny (wp)	280	46	\N	2026-03-07 10:40:35.98	2026-03-07 10:40:35.98	\N
5ccda9a9-2f24-4989-a626-7b8e6921d3c3	PD gohil	test25@gmail.com	9081636399	Hotel Orchid Prime	Cold_Call	New	Hotel Orchid Prime\t\nhttps://maps.app.goo.gl/o1gxxHy95qHuHjJq9\t\t\nBhavnagar\t\n9081636399\t\nCall today 5 PM – Owner PD Gohil(7284844384)\t\nPositive less interested+ demo and details\n11AM meeting fixed	280	46	\N	2026-03-07 10:42:14.145	2026-03-07 10:42:14.145	\N
692b56f3-1293-41ba-951b-10229ae4ecdc	Ghanshyam thakkar	test26@gmail.com	9727282700	Raghuvanshi thal 	Cold_Call	New	https://share.google/SLT1NaKkjcaPmqdj2\nGhanshyam thakkar- raghuvanshi thal \n9727282700\nInterested+ want details	280	46	\N	2026-03-07 10:43:17.145	2026-03-07 10:43:17.145	\N
e7d8ee5f-fd1d-4912-87be-727184021b76	user2	test27@gmail.com	9336000066 	Aristo cafe	Cold_Call	New	9336000066 \nAristo cafe\nAhmedabad\n	280	46	\N	2026-03-07 10:45:04.928	2026-03-07 10:45:04.928	\N
212482c6-58bf-4f50-a9ab-9dbd3024d864	DR Rana	test28@gmail.com	9377111800	Food Bose	Referral	New	Food Bose- DR RANA(Ref by Riddhi ma'am) 9377111800	280	46	\N	2026-03-07 10:46:15.439	2026-03-07 10:46:15.439	\N
b3f97cb7-caa2-4069-8c17-c11e1d37fa09	Himanshubhai	test29@gmail.com	8264771616	Hotel Shree Dhara\t	Cold_Call	New	Hotel Shree Dhara\t\n8264771616\t\nHimanshubhai- Interested- details wp\t\nStation Rd, opp. Murali mandir, Ghanshyam Nagar, Dwarka, Gujarat 361335\t\thttps://maps.app.goo.gl/E5yAW7E8QBsqDQBZ6	280	46	\N	2026-03-07 10:48:31.978	2026-03-07 10:48:31.978	\N
34044465-3dff-4796-ad30-d1b6f4632212	Ashok 	test30@gmail.com	7788875999	Sudarshan Palace By Spree	Cold_Call	New	Sudarshan Palace By Spree\n9731525122-banglore office\t\n7788875999- Ashok interested\nRailway, Station Rd, Ghanshyam Nagar, Dwarka, Gujarat 361335\t\nhttps://www.spreehotels.com/sudarshan-place-by-spree/	280	46	\N	2026-03-07 10:50:05.724	2026-03-07 10:50:05.724	\N
f4841590-5480-4548-8376-64885d36fc45	Ajitbhai Owner	test31@gmail.com	9099955322	Hotel Narayan Inn\t	Cold_Call	New	Hotel Narayan Inn\t\n9099955322\t\nJhon reception- Ajitbhai owner- interested- detail WP\t\nopp. Home Guard Office Home Guard Chowk, Dwarka, Gujarat 361335\t\thttps://maps.app.goo.gl/KDCHnt6h55H7HAt27	280	46	\N	2026-03-07 10:51:19.22	2026-03-07 10:51:19.22	\N
e58e56d0-3b21-4ce2-bfc6-7d5df90f317b	Ashwin	test32@gmail.com	9609696696	Hotel Shree Dwarka\t	Cold_Call	New	Hotel Shree Dwarka\t\n9609696696\t\nAshwin+Details wp\t\nVegetable Market, nr. Dwarikadish tempal, Very, Dwarka, Gujarat 361335\t\thttps://maps.app.goo.gl/MHk8eHk1kdXBcYAS7	280	46	\N	2026-03-07 11:00:46.626	2026-03-07 11:00:46.626	\N
9187cc43-0466-4742-9a00-057740e408ff	Tejas	test33@gmail.com	9726286398	Hotel Leela’s	Cold_Call	New	Hotel Leela’s\t\n9726286398\nTejas- Interested- Details WP\t\nHotel Leela’s, Homeguard Chowk, Dwarka, Gujarat 361335\nhttp://www.hotelleelas.com/\t\nHotel Leela’s	280	46	\N	2026-03-07 11:02:00.518	2026-03-07 11:02:00.518	\N
ab92311a-aaa6-4fa5-b0e0-331e2d0dc3da	Savant gandhi	test34@gmail.com	9825506060	Hotel Shree Vallabh\t	Cold_Call	New	Hotel Shree Vallabh\t\n9825506060\nSavant gandhi- two mutual friends in business 9825506060\t\nDwarkadhish Temple Rd, Dwarka, Gujarat 361335\t\t\nhttps://maps.app.goo.gl/w74LAFbnaxrBBRMt8	280	46	\N	2026-03-07 11:03:09.349	2026-03-07 11:03:09.349	\N
113ed40a-72ad-46e9-a7a1-33582b58a63f	Kishor	test35@gmail.com	9512075000	Hotel lord krishna\t	Cold_Call	New	Hotel lord krishna\t\n9512075000\t\nKishor- interested want details\t\n2nd Floor, Hotel Lord Krishna, MG Rd, above IDBI Bank, Dwarka, Gujarat 361335\t\thttps://maps.app.goo.gl/eW8FpPAeLVLBbqaz6	280	46	\N	2026-03-07 11:04:38.769	2026-03-07 11:04:38.769	\N
afe3aaa7-665d-4045-8d4d-5833de062eb5	Kirtibhai Dave	test36@gmail.com	8200293394	Chitrakut Bungalows	Cold_Call	New	Chitrakut Bungalows - Homestay in Dwarka\t\n8200293394\t\nKirtibhai Dave- 2 hotels and 2 stays( already working on new hotel) Want details demo and Price of product- 9427225810\t\nshidh vatika Society, Siddhnath Mahadev Rd, Dwarka, Gujarat 361335\t\nhttps://www.chitrakutbungalows.in/\t\nChitrakut Bungalows - Homestay in Dwarka	280	46	\N	2026-03-07 11:05:43.94	2026-03-07 11:05:43.94	\N
133b89c7-f264-4a87-bc01-20ddc9422cb3	Shreefal	test37@gmail.com	9879471719	Grand Palace	Cold_Call	New	Grand Palace\t\n9879471719\t\nShreefal- Interested + Details and Demo WP\t\nBirla plot, Nageshwar Rd, near railway stations, Ghanshyam Nagar, Dwarka, Gujarat 361335\thttps://www.dwarkadekho.com/\t\nhttps://maps.app.goo.gl/Wos4VKqPm4RPDTZ38	280	46	\N	2026-03-07 11:06:49.131	2026-03-07 11:06:49.131	\N
a756a63c-bac1-49c7-86be-bf098e7acfcf	Tushar	test38@gmail.com	9054782943	Hotel kaanha	Cold_Call	New	Hotel kaanha\t\n9054782943\t\nTushar- Details WP\t\nBHARATIYA AHIR SAMAJ, near AKHIL, Dwarka, Gujarat 361335\thttps://exotichotelsolutions.com/rooms/hotel-kaanha-dwarka/\thttps://maps.app.goo.gl/KEUxpJ5LRymVddBC9	280	46	\N	2026-03-07 11:07:49.877	2026-03-07 11:07:49.877	\N
3586c275-cc58-45db-aad7-5338612f729a	user3	test39@gmail.com	8980525525	Hotel Gomti	Cold_Call	New	Hotel Gomti\t\n8980525525\t\nInterested- details- WP\t\nDhirubhai Ambani Marg, opp. Gomti River, Dwarka, Gujarat 361335\t\nhttp://www.hotelgomti.com/\t\nhttps://maps.app.goo.gl/cUSSM79DGjYGcJ8R7	280	46	\N	2026-03-07 11:09:54.919	2026-03-07 11:09:54.919	\N
c1adad2b-349e-4c1f-aefb-97d00d93dd09	user5	test40@gmail.com	9904478429	Hotel City Pride\t	Cold_Call	New	Hotel City Pride\t\nhttps://maps.app.goo.gl/RPuQ2EYiPZV1kdU57\t\nBhavnagar\t\n9904478429\t\nInterested – want demo	280	46	\N	2026-03-07 11:11:26.738	2026-03-07 11:11:26.738	\N
a70c6bd7-9c43-4a04-964e-f54d0cc96367	Jaypal	test41@gmail.com	9687888810	Hotel Meriton	Cold_Call	New	Hotel Meriton\t\nhttps://maps.app.goo.gl/ayG5dPAW9z6HCj4U6\t\nBhavnagar\t\n9687888810\t\nInterested – demo (Owner Jaypal)	280	46	\N	2026-03-07 11:13:16.551	2026-03-07 11:13:16.551	\N
b5f87d1e-2959-46c2-8cc4-b714d10d89af	Trupti(Manager)	test42@gmail.com	9904009904	Hotel The Sankalp Retreat	Cold_Call	New	Hotel The Sankalp Retreat\t\nhttps://maps.app.goo.gl/9qmN3aww9xBpbbqr9\t\nBhavnagar\t\n9904009904\t\nInterested – demo (Trupti Manager)	280	46	\N	2026-03-07 11:14:26.304	2026-03-07 11:14:26.304	\N
38bf99d9-c339-4694-b787-f39e323478d0	user6	test43@gmail.com	7575040303	HOTEL 4ReN	Cold_Call	New	HOTEL 4ReN\t\nhttps://maps.app.goo.gl/FzAtCM5gzB8K1dmC9\t\nBhavnagar\t\n7575040303\t\nInterested – want demo (Managers)	280	46	\N	2026-03-07 11:15:29.305	2026-03-07 11:15:29.305	\N
54025528-426a-4cc6-847d-0a7b106b6f19	Mihir(Receptionist)	test44@gmail.com	7777909074	Hotel The Pill	Cold_Call	New	Hotel The Pill\t\nhttps://maps.app.goo.gl/vHNo4FseCgP3T1DL6\t\nBhavnagar\t\n7777909074\t\nMihir – Reception\t\nWp details	280	46	\N	2026-03-07 11:18:44.33	2026-03-07 11:18:44.33	\N
84d0bc67-a962-46c8-bb3f-8ca369478381	Janvi rathod 	test45@gmail.com	7942687827	Hotel Sky Villa	Cold_Call	New	Hotel Sky Villa\t\nhttps://maps.app.goo.gl/rXSjgazXqrPpMVoRA\t\nBhavnagar\t\n7942687827\t\nInterested – Janvi Rathod (Manager)	280	46	\N	2026-03-07 11:20:02.721	2026-03-07 11:20:02.721	\N
3aec438b-7449-4e79-a44e-70efb275bef2	Surpalsinh	test46@gmail.com	6352662733	Hotel SD-9	Cold_Call	New	Hotel SD-9\t\nhttps://maps.app.goo.gl/Q6PqH6JfoJajcQev6\t\nBhavnagar\t\n6352662733\t\nManager busy – Surpalsinh(8154940937) \nwant demo Interested+ Demo	280	46	\N	2026-03-07 11:21:10.382	2026-03-07 11:21:10.382	\N
c7fbfccf-7680-4c22-b909-ce7c051dcdb4	Padma Tiwari	test47@gmail.com	8866096587	Hotel The Basil Park	Cold_Call	New	Hotel The Basil Park\t\nhttps://maps.app.goo.gl/oNZ72BwBH2ZiW4Lq6\t\nBhavnagar\t\n8866096587\t\nInterested – Padma Tiwari male	280	46	\N	2026-03-07 11:22:49.642	2026-03-07 11:22:49.642	\N
844c6ebf-6389-4b0c-b885-78b3b4fd7ac6	Umangbhai	test48@gmail.com	8485940556	Hotel Aura	Cold_Call	New	Hotel Aura\nhttps://maps.app.goo.gl/vAUWnTqrYcAgd83dA\t\nBhavnagar\t\n9904510109\t\nUmangbhai (8485940556)\t\nInterested+ want demo	280	46	\N	2026-03-07 11:25:19.715	2026-03-07 11:25:19.715	\N
1866dde1-b511-4fb0-aa71-9a003ea4c69e	user6	test49@gmail.com	02782510456	Hotel Relax Inn	Cold_Call	New	Hotel Relax Inn\nhttps://maps.app.goo.gl/7NE8PaKeMALrqVfd7\nQ4FW+PJX, Opp. Jilla Panchyat, Darbar Street,, near Shree Ramji & Mahadev Mandir, Bhavnagar, Gujarat 364001\nhttp://www.hotel-relaxinn.com/\n02782510456\nOwner not available, interested	280	46	\N	2026-03-07 11:27:00.548	2026-03-07 11:27:00.548	\N
7a2e4698-2bd1-426c-90f2-99783ec43250	user7	test50@gmail.com	07016000087	Hotel Hare Krishna	Cold_Call	New	Hotel Hare Krishna\nhttps://maps.app.goo.gl/uWx5xim7LdQsmVGR8\n3rd floor, Shivalik trident shakti dham Above SBI bank, near cricket groun, railway station road Near jain derasar , Bhavnagar, Gujarat 364240\n07016000087\ninterested+ want demo	280	46	\N	2026-03-07 11:40:12.276	2026-03-07 11:40:12.276	\N
cf68f900-7fd2-4c80-b084-ce1a4c2fe62d	user8	test51@gmail.com	9898427969	Cheese & Chips	Cold_Call	New	Cheese & Chips\nhttps://maps.app.goo.gl/Mj519N9Mpz2CaRcB7\n9898427969-DEMO	280	46	\N	2026-03-07 11:41:16.238	2026-03-07 11:41:16.238	\N
5b7fe089-c1d5-408a-aa21-36e52b321e4c	Ajaysinh	test52@gmail.com	+918401074592	Zorko Brand Of Food Lovers	Cold_Call	New	Zorko Brand Of Food Lovers\nAjaysinh +918401074592\nInterested+Demo\nZomato	280	46	\N	2026-03-07 11:42:09.909	2026-03-07 11:42:09.909	\N
\.


--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leave_requests (id, "employeeId", "startDate", "endDate", type, reason, status, "approvedById", "managerNote", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, module, action, "scopeType", description, "createdAt", "updatedAt") FROM stdin;
1345	leads	view	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1346	leads	view	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1347	leads	view	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1348	leads	view	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1349	leads	create	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1350	leads	create	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1351	leads	create	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1352	leads	create	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1353	leads	edit	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1354	leads	edit	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1355	leads	edit	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1356	leads	edit	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1357	leads	delete	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1358	leads	delete	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1359	leads	delete	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1360	leads	delete	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1361	leads	assign	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1362	leads	assign	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1363	leads	assign	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1364	leads	assign	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1365	tasks	view	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1366	tasks	view	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1367	tasks	view	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1368	tasks	view	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1369	tasks	create	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1370	tasks	create	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1371	tasks	create	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1372	tasks	create	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1373	tasks	edit	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1374	tasks	edit	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1375	tasks	edit	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1376	tasks	edit	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1377	tasks	delete	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1378	tasks	delete	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1379	tasks	delete	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1380	tasks	delete	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1381	tasks	assign	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1382	tasks	assign	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1383	tasks	assign	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1384	tasks	assign	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1385	projects	view	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1386	projects	view	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1387	projects	view	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1388	projects	view	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1389	projects	create	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1390	projects	create	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1391	projects	create	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1392	projects	create	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1393	projects	edit	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1394	projects	edit	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1395	projects	edit	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1396	projects	edit	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1397	projects	delete	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1398	projects	delete	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1399	projects	delete	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1400	projects	delete	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1401	products	view	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1402	products	view	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1403	products	view	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1404	products	view	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1405	products	create	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1406	products	create	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1407	products	create	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1408	products	create	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1409	products	edit	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1410	products	edit	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1411	products	edit	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1412	products	edit	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1413	products	delete	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1414	products	delete	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1415	products	delete	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1416	products	delete	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1417	attendance	view	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1418	attendance	view	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1419	attendance	view	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1420	attendance	view	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1421	attendance	create	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1422	attendance	create	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1423	attendance	create	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1424	attendance	create	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1425	attendance	approve	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1426	attendance	approve	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1427	attendance	approve	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1428	attendance	approve	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1429	leaves	view	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1430	leaves	view	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1431	leaves	view	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1432	leaves	view	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1433	leaves	create	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1434	leaves	create	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1435	leaves	create	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1436	leaves	create	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1437	leaves	approve	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1438	leaves	approve	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1439	leaves	approve	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1440	leaves	approve	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1441	eod	view	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1442	eod	view	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1443	eod	view	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1444	eod	view	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1445	eod	create	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1446	eod	create	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1447	eod	create	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1448	eod	create	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1449	eod	edit	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1450	eod	edit	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1451	eod	edit	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1452	eod	edit	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1453	reports	view	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1454	reports	view	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1455	reports	view	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1456	reports	view	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1457	reports	generate	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1458	reports	generate	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1459	reports	generate	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1460	reports	generate	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1461	employees	view	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1462	employees	view	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1463	employees	view	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1464	employees	view	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1465	employees	edit	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1466	employees	edit	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1467	employees	edit	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1468	employees	edit	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1469	employees	manage	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1470	employees	manage	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1471	employees	manage	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1472	employees	manage	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1473	activity	view	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1474	activity	view	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1475	activity	view	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1476	activity	view	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1477	dashboard	view	own	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1478	dashboard	view	team	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1479	dashboard	view	department	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
1480	dashboard	view	all	\N	2026-03-06 09:00:13.909	2026-03-06 09:00:13.909
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, description, price, category, "isActive", "createdAt", "updatedAt", "productManagerId", status) FROM stdin;
43	Ai document systems		0		t	2026-03-06 13:35:56.441	2026-03-06 13:35:56.441	283	Active
44	AI Menu System 	<p><strong>AI&nbsp;Menu&nbsp;System</strong>&nbsp;is&nbsp;a&nbsp;smart&nbsp;digital&nbsp;menu&nbsp;platform&nbsp;for&nbsp;restaurants&nbsp;that&nbsp;replaces&nbsp;traditional&nbsp;menus&nbsp;with&nbsp;an&nbsp;interactive&nbsp;<strong>QR-based&nbsp;menu&nbsp;powered&nbsp;by&nbsp;AI</strong>.&nbsp;Customers&nbsp;scan&nbsp;a&nbsp;QR&nbsp;code&nbsp;to&nbsp;view&nbsp;the&nbsp;menu&nbsp;on&nbsp;their&nbsp;phone,&nbsp;explore&nbsp;dishes&nbsp;with&nbsp;images,&nbsp;get&nbsp;AI-powered&nbsp;recommendations,&nbsp;and&nbsp;even&nbsp;interact&nbsp;with&nbsp;a&nbsp;voice&nbsp;or&nbsp;chat&nbsp;assistant&nbsp;to&nbsp;ask&nbsp;about&nbsp;ingredients,&nbsp;combos,&nbsp;or&nbsp;popular&nbsp;items.</p>	0	AI System 	t	2026-03-06 21:30:05.528	2026-03-06 21:32:09.677	289	Active
45	CRM System	<p>CRM</p>	0		t	2026-03-12 06:01:03.954	2026-03-12 06:01:03.954	286	Active
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, name, description, "leadId", "createdAt", "updatedAt", "projectManagerId", "relationshipManagerId", status) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_permissions (id, "roleId", "permissionId", "createdAt", "updatedAt") FROM stdin;
9875	137	1348	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9876	137	1352	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9877	137	1356	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9878	137	1360	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9879	137	1364	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9880	137	1368	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9881	137	1372	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9882	137	1376	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9883	137	1380	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9884	137	1384	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9885	137	1388	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9886	137	1404	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9887	137	1408	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9888	137	1400	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9889	137	1396	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9890	137	1392	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9891	137	1412	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9892	137	1416	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9893	137	1420	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9894	137	1424	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9895	137	1428	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9896	137	1432	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9897	137	1436	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9898	137	1440	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9899	137	1444	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9900	137	1448	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9901	137	1452	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9902	137	1456	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9903	137	1460	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9904	137	1464	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9905	137	1468	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9906	137	1472	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9907	137	1476	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9908	137	1480	2026-03-12 05:59:44.56	2026-03-12 05:59:44.56
9909	138	1348	2026-03-12 05:59:45	2026-03-12 05:59:45
9910	138	1352	2026-03-12 05:59:45	2026-03-12 05:59:45
9911	138	1355	2026-03-12 05:59:45	2026-03-12 05:59:45
9912	138	1364	2026-03-12 05:59:45	2026-03-12 05:59:45
9913	138	1367	2026-03-12 05:59:45	2026-03-12 05:59:45
9914	138	1371	2026-03-12 05:59:45	2026-03-12 05:59:45
9915	138	1375	2026-03-12 05:59:45	2026-03-12 05:59:45
9916	138	1383	2026-03-12 05:59:45	2026-03-12 05:59:45
9917	138	1419	2026-03-12 05:59:45	2026-03-12 05:59:45
9918	138	1421	2026-03-12 05:59:45	2026-03-12 05:59:45
9919	138	1431	2026-03-12 05:59:45	2026-03-12 05:59:45
9920	138	1433	2026-03-12 05:59:45	2026-03-12 05:59:45
9921	138	1443	2026-03-12 05:59:45	2026-03-12 05:59:45
9922	138	1445	2026-03-12 05:59:45	2026-03-12 05:59:45
9923	138	1455	2026-03-12 05:59:45	2026-03-12 05:59:45
9924	138	1459	2026-03-12 05:59:45	2026-03-12 05:59:45
9925	138	1463	2026-03-12 05:59:45	2026-03-12 05:59:45
9926	138	1475	2026-03-12 05:59:45	2026-03-12 05:59:45
9927	138	1479	2026-03-12 05:59:45	2026-03-12 05:59:45
9928	139	1345	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9929	139	1349	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9930	139	1353	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9931	139	1361	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9932	139	1365	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9933	139	1417	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9934	139	1421	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9935	139	1429	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9936	139	1433	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9937	139	1441	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9938	139	1445	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9939	139	1453	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9940	139	1473	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9941	139	1477	2026-03-12 05:59:45.339	2026-03-12 05:59:45.339
9942	140	1346	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9943	140	1349	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9944	140	1353	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9945	140	1362	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9946	140	1366	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9947	140	1370	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9948	140	1382	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9949	140	1418	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9950	140	1421	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9951	140	1430	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9952	140	1433	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9953	140	1442	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9954	140	1445	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9955	140	1454	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9956	140	1474	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9957	140	1478	2026-03-12 05:59:45.676	2026-03-12 05:59:45.676
9958	141	1347	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9959	141	1349	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9960	141	1354	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9961	141	1363	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9962	141	1367	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9963	141	1371	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9964	141	1382	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9965	141	1419	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9966	141	1421	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9967	141	1431	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9968	141	1433	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9969	141	1443	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9970	141	1445	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9971	141	1455	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9972	141	1475	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9973	141	1479	2026-03-12 05:59:46.012	2026-03-12 05:59:46.012
9974	142	1348	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9975	142	1352	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9976	142	1356	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9977	142	1360	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9978	142	1364	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9979	142	1368	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9980	142	1372	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9981	142	1376	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9982	142	1380	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9983	142	1384	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9984	142	1388	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9985	142	1392	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9986	142	1396	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9987	142	1400	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9988	142	1404	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9989	142	1408	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9990	142	1412	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9991	142	1416	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9992	142	1420	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9993	142	1424	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9994	142	1428	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9995	142	1432	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9996	142	1436	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9997	142	1440	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9998	142	1444	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
9999	142	1448	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
10000	142	1452	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
10001	142	1456	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
10002	142	1460	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
10003	142	1464	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
10004	142	1468	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
10005	142	1472	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
10006	142	1476	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
10007	142	1480	2026-03-12 05:59:46.35	2026-03-12 05:59:46.35
10008	143	1345	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10009	143	1349	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10010	143	1353	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10011	143	1361	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10012	143	1365	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10013	143	1417	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10014	143	1421	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10015	143	1429	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10016	143	1433	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10017	143	1441	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10018	143	1445	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10019	143	1453	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10020	143	1473	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10021	143	1477	2026-03-12 05:59:46.688	2026-03-12 05:59:46.688
10022	145	1345	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10023	145	1349	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10024	145	1421	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10025	145	1433	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10026	145	1445	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10027	145	1361	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10028	145	1367	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10029	145	1371	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10030	145	1375	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10031	145	1477	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10032	145	1383	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10033	145	1385	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10034	145	1389	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10035	145	1401	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10036	145	1405	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10037	145	1417	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10038	145	1429	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10039	145	1441	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10040	145	1453	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10041	145	1457	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10042	145	1461	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10043	145	1473	2026-03-12 05:59:47.024	2026-03-12 05:59:47.024
10044	147	1345	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10045	147	1349	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10046	147	1361	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10047	147	1367	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10048	147	1371	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10049	147	1375	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10050	147	1383	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10051	147	1387	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10052	147	1391	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10053	147	1395	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10054	147	1403	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10055	147	1407	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10056	147	1411	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10057	147	1419	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10058	147	1431	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10059	147	1433	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10060	147	1421	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10061	147	1443	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10062	147	1445	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10063	147	1455	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10064	147	1459	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10065	147	1463	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10066	147	1475	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10067	147	1479	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10068	147	1377	2026-03-12 05:59:47.36	2026-03-12 05:59:47.36
10069	148	1365	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10070	148	1385	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10071	148	1401	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10072	148	1417	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10073	148	1421	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10074	148	1429	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10075	148	1433	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10076	148	1441	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10077	148	1445	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10078	148	1453	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10079	148	1473	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10080	148	1477	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10081	148	1373	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10082	148	1369	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10083	148	1377	2026-03-12 05:59:47.697	2026-03-12 05:59:47.697
10084	149	1367	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10085	149	1371	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10086	149	1383	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10087	149	1403	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10088	149	1407	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10089	149	1411	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10090	149	1419	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10091	149	1421	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10092	149	1431	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10093	149	1433	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10094	149	1443	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10095	149	1445	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10096	149	1455	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10097	149	1459	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10098	149	1463	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10099	149	1475	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10100	149	1479	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10101	149	1373	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10102	149	1377	2026-03-12 05:59:48.04	2026-03-12 05:59:48.04
10103	150	1366	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10104	150	1370	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10105	150	1382	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10106	150	1402	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10107	150	1418	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10108	150	1421	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10109	150	1430	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10110	150	1433	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10111	150	1442	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10112	150	1445	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10113	150	1454	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10114	150	1462	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10115	150	1474	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10116	150	1478	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10117	150	1377	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10118	150	1373	2026-03-12 05:59:48.378	2026-03-12 05:59:48.378
10119	151	1365	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10120	151	1401	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10121	151	1417	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10122	151	1421	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10123	151	1429	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10124	151	1433	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10125	151	1441	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10126	151	1445	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10127	151	1453	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10128	151	1473	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10129	151	1477	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10130	151	1369	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10131	151	1373	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10132	151	1377	2026-03-12 05:59:48.714	2026-03-12 05:59:48.714
10133	152	1365	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10134	152	1385	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10135	152	1401	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10136	152	1417	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10137	152	1421	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10138	152	1429	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10139	152	1433	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10140	152	1441	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10141	152	1445	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10142	152	1453	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10143	152	1473	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10144	152	1477	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10145	152	1373	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10146	152	1369	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10147	152	1377	2026-03-12 05:59:49.049	2026-03-12 05:59:49.049
10148	153	1365	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10149	153	1369	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10150	153	1373	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10151	153	1377	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10152	153	1401	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10153	153	1417	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10154	153	1421	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10155	153	1429	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10156	153	1433	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10157	153	1441	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10158	153	1445	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10159	153	1453	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10160	153	1473	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10161	153	1477	2026-03-12 05:59:49.385	2026-03-12 05:59:49.385
10162	154	1365	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10163	154	1373	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10164	154	1369	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10165	154	1377	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10166	154	1385	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10167	154	1401	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10168	154	1417	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10169	154	1421	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10170	154	1429	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10171	154	1433	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10172	154	1441	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10173	154	1445	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10174	154	1453	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10175	154	1473	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10176	154	1477	2026-03-12 05:59:49.721	2026-03-12 05:59:49.721
10177	157	1365	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10178	157	1373	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10179	157	1369	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10180	157	1377	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10181	157	1385	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10182	157	1401	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10183	157	1417	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10184	157	1421	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10185	157	1429	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10186	157	1433	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10187	157	1441	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10188	157	1445	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10189	157	1453	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10190	157	1473	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10191	157	1477	2026-03-12 05:59:50.056	2026-03-12 05:59:50.056
10192	158	1368	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10193	158	1370	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10194	158	1382	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10195	158	1388	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10196	158	1404	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10197	158	1420	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10198	158	1421	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10199	158	1428	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10200	158	1432	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10201	158	1433	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10202	158	1440	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10203	158	1444	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10204	158	1445	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10205	158	1456	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10206	158	1460	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10207	158	1464	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10208	158	1468	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10209	158	1472	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10210	158	1476	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
10211	158	1480	2026-03-12 05:59:50.396	2026-03-12 05:59:50.396
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, code, description, "isActive", "createdAt", "updatedAt", "departmentId", "roleVersion") FROM stdin;
137	Admin	ADMIN	Full system control	t	2026-03-06 09:00:13.054	2026-03-12 05:59:44.744	41	17
138	Head Of Department	HOD		t	2026-03-06 10:12:46.262	2026-03-12 05:59:45.168	42	21
139	Business Development Executive	BDE		t	2026-03-06 10:14:19.821	2026-03-12 05:59:45.507	42	17
140	Business Development Manager	BDM		t	2026-03-06 10:14:53.249	2026-03-12 05:59:45.843	42	17
141	Business Manager	BM		t	2026-03-06 10:15:08.806	2026-03-12 05:59:46.18	42	17
142	Chief Executive Officer	CEO		t	2026-03-06 10:17:30.421	2026-03-12 05:59:46.52	41	18
143	Relationship Manager	RM		t	2026-03-06 10:19:55.898	2026-03-12 05:59:46.856	42	19
145	Operations Manager 	OM		t	2026-03-06 12:42:54.196	2026-03-12 05:59:47.193	46	16
147	Head Of Creative 	HOD_CreaTIVE		t	2026-03-06 12:51:24.703	2026-03-12 05:59:47.528	44	14
148	UIUX Designer	UIUX		t	2026-03-06 19:20:25.248	2026-03-12 05:59:47.872	44	13
149	Head Of Product 	HOD_PRODUCT		t	2026-03-06 20:43:20.16	2026-03-12 05:59:48.209	43	11
150	Product Manager	PM		t	2026-03-06 20:43:37.858	2026-03-12 05:59:48.546	43	11
151	Product Architect 	PROD_ARC		t	2026-03-06 20:44:26.3	2026-03-12 05:59:48.881	43	11
152	Graphic Designer 	GRA_DES		t	2026-03-06 21:25:13.492	2026-03-12 05:59:49.217	44	7
153	Product Developer  Intern	PROD_DEV_INTRN		t	2026-03-08 11:43:28.794	2026-03-12 05:59:49.553	43	6
154	UIUX Intern 	UIUX_INTRN		t	2026-03-08 11:45:43.814	2026-03-12 05:59:49.888	44	5
157	Graphic Designer Intern	GRA_DESi_INTRN		t	2026-03-08 11:46:47.119	2026-03-12 05:59:50.228	44	5
158	HR Manager	HRM		t	2026-03-08 11:50:41.627	2026-03-12 05:59:50.564	41	5
159	Head Of Project	HEAD_PROJ		t	2026-03-08 11:54:20.771	2026-03-12 05:59:50.733	47	6
161	Project Manager 	PROJ_M		t	2026-03-08 11:56:09.47	2026-03-12 05:59:50.9	47	5
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tasks (id, title, description, "assigneeId", "creatorId", "dueDate", priority, status, "relatedToLeadId", "projectId", "productId", "completedAt", "createdAt", "updatedAt", "completionNote") FROM stdin;
23a06fc0-756c-4fcf-9802-9cd3b3ea3da9	Usus	Sus	286	286	2026-03-11 00:00:00	Low	In Progress	\N	\N	\N	\N	2026-03-10 07:00:42.066	2026-03-10 07:13:13.588	\N
7391927e-bf8d-4c00-92b9-ee3ed344b3f3	logo of mm and uiux work 	working on media masala full uiux 	284	284	2026-10-03 00:00:00	Medium	Pending	\N	\N	\N	\N	2026-03-10 07:36:02.873	2026-03-10 07:36:02.873	\N
7fe242c9-1768-427a-b471-e98ddc9b5f46	Client work update	Hotel Aaradhana, Bharosa fast food, Backbencher's cafe, little heaven\n4 Clients of Rashmi & Dashraj \nno updates from tech department .\nDigital menu and software not given yet	280	280	2026-03-15 00:00:00	High	Pending	\N	\N	44	\N	2026-03-07 06:00:02.235	2026-03-10 08:13:05.446	\N
df418d4f-15c9-4b97-b5a9-615a8fd58ce4	Changes and issue resolve	- Pagination and sorting in all tables\n- each description textarea should have editor\n- solve issues of frontend in live production repo\n- show lead created by in lead module	286	279	2026-03-13 00:00:00	High	Pending	\N	\N	45	\N	2026-03-12 06:04:24.967	2026-03-12 06:07:18.523	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, "passwordHash", "isActive", "createdAt", "updatedAt") FROM stdin;
285	danish@gmail.com	$2b$10$2tJIg/Nr8ZVl1utmci/HnOPwxZcd0LbtvXfkV1J0t/LkjvL0twp8G	t	2026-03-06 20:39:10.041	2026-03-06 20:39:10.041
286	alfazb@gmail.com	$2b$10$xv6Fs5qFgYTPhqugPPITWu4hPvUhNiYf9H1Jj9ShuzIBftR/2k31C	t	2026-03-06 20:45:28.441	2026-03-06 20:45:28.441
287	dhanashreeT@gmail.com	$2b$10$ldbvd79LmAERRH8Aur9yWeaDy7WO5mAXH9ywQk6dECHoNXEtv9qze	t	2026-03-06 20:56:24.941	2026-03-06 20:56:24.941
288	darshraj@gmail.com	$2b$10$kWm4agColyGjNnJuragDFOHAODF2wl1id/YT2zsJGYYSB3D0Jscz6	t	2026-03-06 21:00:45.143	2026-03-06 21:00:45.143
289	bhargavmg@gmail.com	$2b$10$BdJlrfmqU9IpkPjSCGQLPOMCaf4hfsfT47PQwHck9XmtQJOkr0Uha	t	2026-03-06 21:31:32.543	2026-03-06 21:31:52.601
290	shubham748856@gmail.com	$2b$10$TDnhRrmjf6FGAaR5BFD1leMIPad5UK8Ii5X2Lt6Fhcrzjcxq65BfO	t	2026-03-08 11:45:11.344	2026-03-08 11:45:11.344
291	dadhaniyaaneri@gmail.com	$2b$10$kClXiWRoT0domWxACwmeUeuqSEyUGva766SOaiY5crPkTSoetchX2	t	2026-03-08 11:48:31.942	2026-03-08 11:48:31.942
292	manishatejvani26@gmail.com	$2b$10$1GHwW.VCKj4/FC9sMZRdEOGKXwpZ3s1KV9loD.PLZT8kLNxxAoSRK	t	2026-03-08 11:49:11.042	2026-03-08 11:49:11.042
294	dhanashri.k0409@gmail.com	$2b$10$ppWbJJbbgRXWgVePH2Hvx.0MirnI8bYp9svHkctqRTu0dKSxSCU8W	t	2026-03-08 11:50:15.642	2026-03-08 11:50:15.642
295	raviparmar11102001@gmail.com	$2b$10$3QlcjWTN4yhs6HJUcJt/3OoZgurTBXIM8VIdBYZmbLlbtbmv.VqrG	t	2026-03-08 11:51:37.84	2026-03-08 11:51:37.84
297	jaiswaltanu1705@gmail.com	$2b$10$OLAnmvDmWW0NXPXqPnWTJ.kS1FCeSkOolh5laHuzeKTKwcLHt6fH2	t	2026-03-08 11:57:44.741	2026-03-08 11:57:44.741
282	parmarakshat23@gmail.com	$2b$10$ttaQvICzUoEOydH8Xc4EtukcYV30mUNNChybl80Ca4s.tkUUxOVem	t	2026-03-06 10:26:31.042	2026-03-08 12:15:47.676
296	hanshika12004@gmail.com	$2b$10$YqSXRQVGbEBc6sCvKiH3SO74vVPJA3IIsNONUQoS88bgl/JBUpDTq	t	2026-03-08 11:52:35.543	2026-03-09 08:44:54.698
293	shreyakhedkar06@gmail.com	$2b$10$C.1162LPslKWpKR.eUph4OOqJLjjgOeh7u0Ky8tfwIYsRExzg1sHO	t	2026-03-08 11:49:41.037	2026-03-09 08:46:45.346
298	testuser@gmail.com	$2b$10$jItvh0IkPPT0huOj1rgsU.nzBPaOP2umwMrv3Se1Xz99xJlR7CNoe	t	2026-03-09 10:56:39.484	2026-03-09 10:56:39.484
279	mediaamasala@gmail.com	$2b$10$jvwDI0YAQ0fqgVmyyODl4.GZ.mR/cbJ8gsnSSX0Rw3zEAmpTeq.3q	t	2026-03-06 09:00:19.246	2026-03-06 09:00:19.246
281	kiranchoudhary5931@gmail.com	$2b$10$EXb3r.J6TdeazzAblUARUeSzkXgK55Db5BsUl.U7mG/Jl3YElk2S.	t	2026-03-06 10:22:04.541	2026-03-06 10:22:04.541
280	rpdesigner36@gmail.com	$2b$10$4QW3K5UCswhrZp/95PwfjeysTrKKpMcR2iMqHuWQ5TzMl5gly8wGu	t	2026-03-06 10:18:43.543	2026-03-06 12:43:23.933
283	krishishah@gmail.com	$2b$10$bU7DI7sT9VgGv6Vi.trKO.kefAdkIKVYvBSuCsRYMjg3fElWxpPjG	t	2026-03-06 12:44:58.344	2026-03-06 12:51:40.086
284	shifagodil07@gmail.com	$2b$10$ffGXrL7H2aXfjdZuusTEbOHACAy32QqrrvvxfUdYXAxAsQf8VgxAu	t	2026-03-06 19:21:31.245	2026-03-06 19:21:31.245
\.


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 262, true);


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.attendance_id_seq', 1860, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.departments_id_seq', 47, true);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.employees_id_seq', 299, true);


--
-- Name: eod_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.eod_reports_id_seq', 390, true);


--
-- Name: follow_up_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.follow_up_logs_id_seq', 1, false);


--
-- Name: lead_assignment_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lead_assignment_logs_id_seq', 1, false);


--
-- Name: lead_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lead_notes_id_seq', 102, true);


--
-- Name: leave_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.leave_requests_id_seq', 7, true);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.permissions_id_seq', 1480, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 45, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.projects_id_seq', 32, true);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 10211, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 161, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 298, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: eod_reports eod_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eod_reports
    ADD CONSTRAINT eod_reports_pkey PRIMARY KEY (id);


--
-- Name: follow_up_logs follow_up_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_up_logs
    ADD CONSTRAINT follow_up_logs_pkey PRIMARY KEY (id);


--
-- Name: lead_assignment_logs lead_assignment_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_assignment_logs
    ADD CONSTRAINT lead_assignment_logs_pkey PRIMARY KEY (id);


--
-- Name: lead_notes lead_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_notes
    ADD CONSTRAINT lead_notes_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: leave_requests leave_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: activity_logs_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "activity_logs_createdAt_idx" ON public.activity_logs USING btree ("createdAt");


--
-- Name: activity_logs_employeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "activity_logs_employeeId_idx" ON public.activity_logs USING btree ("employeeId");


--
-- Name: activity_logs_entityId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "activity_logs_entityId_idx" ON public.activity_logs USING btree ("entityId");


--
-- Name: activity_logs_module_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "activity_logs_module_createdAt_idx" ON public.activity_logs USING btree (module, "createdAt");


--
-- Name: activity_logs_module_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activity_logs_module_idx ON public.activity_logs USING btree (module);


--
-- Name: attendance_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_date_idx ON public.attendance USING btree (date);


--
-- Name: attendance_employeeId_date_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "attendance_employeeId_date_key" ON public.attendance USING btree ("employeeId", date);


--
-- Name: attendance_employeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attendance_employeeId_idx" ON public.attendance USING btree ("employeeId");


--
-- Name: attendance_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_status_idx ON public.attendance USING btree (status);


--
-- Name: departments_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX departments_code_key ON public.departments USING btree (code);


--
-- Name: departments_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX departments_name_key ON public.departments USING btree (name);


--
-- Name: employees_departmentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "employees_departmentId_idx" ON public.employees USING btree ("departmentId");


--
-- Name: employees_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX employees_email_key ON public.employees USING btree (email);


--
-- Name: employees_empId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "employees_empId_key" ON public.employees USING btree ("empId");


--
-- Name: employees_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "employees_isActive_idx" ON public.employees USING btree ("isActive");


--
-- Name: employees_managerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "employees_managerId_idx" ON public.employees USING btree ("managerId");


--
-- Name: employees_roleId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "employees_roleId_idx" ON public.employees USING btree ("roleId");


--
-- Name: employees_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "employees_userId_key" ON public.employees USING btree ("userId");


--
-- Name: eod_reports_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX eod_reports_date_idx ON public.eod_reports USING btree (date);


--
-- Name: eod_reports_employeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "eod_reports_employeeId_idx" ON public.eod_reports USING btree ("employeeId");


--
-- Name: follow_up_logs_completedDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "follow_up_logs_completedDate_idx" ON public.follow_up_logs USING btree ("completedDate");


--
-- Name: follow_up_logs_employeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "follow_up_logs_employeeId_idx" ON public.follow_up_logs USING btree ("employeeId");


--
-- Name: follow_up_logs_leadId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "follow_up_logs_leadId_idx" ON public.follow_up_logs USING btree ("leadId");


--
-- Name: follow_up_logs_scheduledDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "follow_up_logs_scheduledDate_idx" ON public.follow_up_logs USING btree ("scheduledDate");


--
-- Name: lead_assignment_logs_assignedToId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "lead_assignment_logs_assignedToId_idx" ON public.lead_assignment_logs USING btree ("assignedToId");


--
-- Name: lead_assignment_logs_leadId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "lead_assignment_logs_leadId_idx" ON public.lead_assignment_logs USING btree ("leadId");


--
-- Name: lead_notes_authorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "lead_notes_authorId_idx" ON public.lead_notes USING btree ("authorId");


--
-- Name: lead_notes_leadId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "lead_notes_leadId_idx" ON public.lead_notes USING btree ("leadId");


--
-- Name: leads_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leads_createdAt_idx" ON public.leads USING btree ("createdAt");


--
-- Name: leads_departmentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leads_departmentId_idx" ON public.leads USING btree ("departmentId");


--
-- Name: leads_ownerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leads_ownerId_idx" ON public.leads USING btree ("ownerId");


--
-- Name: leads_ownerId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leads_ownerId_status_idx" ON public.leads USING btree ("ownerId", status);


--
-- Name: leads_source_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_source_idx ON public.leads USING btree (source);


--
-- Name: leads_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_status_idx ON public.leads USING btree (status);


--
-- Name: leave_requests_employeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_requests_employeeId_idx" ON public.leave_requests USING btree ("employeeId");


--
-- Name: leave_requests_endDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_requests_endDate_idx" ON public.leave_requests USING btree ("endDate");


--
-- Name: leave_requests_startDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_requests_startDate_idx" ON public.leave_requests USING btree ("startDate");


--
-- Name: leave_requests_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leave_requests_status_idx ON public.leave_requests USING btree (status);


--
-- Name: permissions_module_action_scopeType_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "permissions_module_action_scopeType_key" ON public.permissions USING btree (module, action, "scopeType");


--
-- Name: products_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX products_name_key ON public.products USING btree (name);


--
-- Name: products_productManagerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_productManagerId_idx" ON public.products USING btree ("productManagerId");


--
-- Name: projects_leadId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "projects_leadId_key" ON public.projects USING btree ("leadId");


--
-- Name: projects_projectManagerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "projects_projectManagerId_idx" ON public.projects USING btree ("projectManagerId");


--
-- Name: projects_relationshipManagerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "projects_relationshipManagerId_idx" ON public.projects USING btree ("relationshipManagerId");


--
-- Name: projects_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX projects_status_idx ON public.projects USING btree (status);


--
-- Name: role_permissions_roleId_permissionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON public.role_permissions USING btree ("roleId", "permissionId");


--
-- Name: roles_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX roles_code_key ON public.roles USING btree (code);


--
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- Name: tasks_assigneeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tasks_assigneeId_idx" ON public.tasks USING btree ("assigneeId");


--
-- Name: tasks_assigneeId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tasks_assigneeId_status_idx" ON public.tasks USING btree ("assigneeId", status);


--
-- Name: tasks_creatorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tasks_creatorId_idx" ON public.tasks USING btree ("creatorId");


--
-- Name: tasks_dueDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tasks_dueDate_idx" ON public.tasks USING btree ("dueDate");


--
-- Name: tasks_priority_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tasks_priority_idx ON public.tasks USING btree (priority);


--
-- Name: tasks_productId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tasks_productId_idx" ON public.tasks USING btree ("productId");


--
-- Name: tasks_projectId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tasks_projectId_idx" ON public.tasks USING btree ("projectId");


--
-- Name: tasks_projectId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tasks_projectId_status_idx" ON public.tasks USING btree ("projectId", status);


--
-- Name: tasks_relatedToLeadId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tasks_relatedToLeadId_idx" ON public.tasks USING btree ("relatedToLeadId");


--
-- Name: tasks_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tasks_status_idx ON public.tasks USING btree (status);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: activity_logs activity_logs_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT "activity_logs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: attendance attendance_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT "attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: employees employees_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: employees employees_managerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "employees_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employees employees_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "employees_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: employees employees_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: eod_reports eod_reports_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eod_reports
    ADD CONSTRAINT "eod_reports_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: follow_up_logs follow_up_logs_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_up_logs
    ADD CONSTRAINT "follow_up_logs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: follow_up_logs follow_up_logs_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_up_logs
    ADD CONSTRAINT "follow_up_logs_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lead_assignment_logs lead_assignment_logs_assignedToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_assignment_logs
    ADD CONSTRAINT "lead_assignment_logs_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lead_assignment_logs lead_assignment_logs_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_assignment_logs
    ADD CONSTRAINT "lead_assignment_logs_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lead_assignment_logs lead_assignment_logs_performedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_assignment_logs
    ADD CONSTRAINT "lead_assignment_logs_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lead_notes lead_notes_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_notes
    ADD CONSTRAINT "lead_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lead_notes lead_notes_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_notes
    ADD CONSTRAINT "lead_notes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: leads leads_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT "leads_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: leads leads_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT "leads_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_approvedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT "leave_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT "leave_requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: products products_productManagerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_productManagerId_fkey" FOREIGN KEY ("productManagerId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: projects projects_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: projects projects_projectManagerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_projectManagerId_fkey" FOREIGN KEY ("projectManagerId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: projects projects_relationshipManagerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_relationshipManagerId_fkey" FOREIGN KEY ("relationshipManagerId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: role_permissions role_permissions_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: role_permissions role_permissions_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: roles roles_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "roles_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tasks tasks_assigneeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tasks tasks_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tasks tasks_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tasks tasks_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tasks tasks_relatedToLeadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_relatedToLeadId_fkey" FOREIGN KEY ("relatedToLeadId") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict q3dNTWjqMWmK3s5O6ERAcxg4KP91vF0IgYt7ppU6jdM5Br9y9PIB7ttDMCIf3YT

