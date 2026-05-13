Installing Dependencies

Cd backend_api
Npm install
Create an .env file and in it fill out:
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
isProd=
port=
password=

Cd ..
Cd frontend
Cd my-react-app
Npm instal

Database set up
Install docker https://www.docker.com/get-started/ 
In your terminal run the following while replacing the password, name and port if needed
docker run -e "ACCEPT_EULA=Y" \
  -e 'SA_PASSWORD=YourStrong!Passw0rd' \
  -p 1434:1433 \
  --name sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest

Verify the container is running: docker ps


Connecting to server using Visual Studio SQL Server extension: 

Install this extension in your code editor or here:
https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql 

Add your connection using the credentials used when doing the docker run command

Create a database called ForumApplication

Create a new query and run:
CREATE TABLE [Accounts] ( [account_name] nvarchar(100), [account_id] int PRIMARY KEY IDENTITY(1, 1), [created_at] nvarchar(100) ) ;

CREATE TABLE [Forums] ( [forum_name] nvarchar(100), [forum_id] int PRIMARY KEY IDENTITY(1, 1), [forum_description] nvarchar(100), [created_by] int, [created_at] nvarchar(100) ) ;

CREATE TABLE [Threads] ( [thread_name] nvarchar(100), [thread_id] int PRIMARY KEY IDENTITY(1, 1), [forum_id] int, [created_by] int, [created_at] nvarchar(100) ) 

CREATE TABLE [Posts] ( [thread_id] int, [account_id] int, [post_id] int PRIMARY KEY IDENTITY(1, 1), [post_number] int, [created_at] nvarchar(100), [post_text] nvarchar(100), [is_deleted] bit ) 

CREATE TABLE [AccountCredentials] ( [account_id] int PRIMARY KEY, [email] nvarchar(100) UNIQUE, [password_hash] nvarchar(100), [isAdmin] bit ) 

ALTER TABLE [Forums] ADD FOREIGN KEY ([created_by]) REFERENCES [Accounts] ([account_id]) 

ALTER TABLE [Threads] ADD FOREIGN KEY ([forum_id]) REFERENCES [Forums] ([forum_id]) 

ALTER TABLE [Threads] ADD FOREIGN KEY ([created_by]) REFERENCES [Accounts] ([account_id]) 

ALTER TABLE [Posts] ADD FOREIGN KEY ([thread_id]) REFERENCES [Threads] ([thread_id]) 

ALTER TABLE [Posts] ADD FOREIGN KEY ([account_id]) REFERENCES [Accounts] ([account_id]) 

ALTER TABLE [AccountCredentials] ADD FOREIGN KEY ([account_id]) REFERENCES [Accounts] ([account_id]) 

CREATE TABLE RefreshTokens ( refresh_token_id INT IDENTITY(1,1) PRIMARY KEY, account_id INT NOT NULL, token_hash NVARCHAR(255) NOT NULL UNIQUE, jti NVARCHAR(255) NOT NULL UNIQUE, expires_at DATETIME2 NOT NULL, revoked_at DATETIME2 NULL, replaced_by NVARCHAR(255) NULL, created_at DATETIME2 NOT NULL DEFAULT GETDATE(), ip NVARCHAR(50) NULL, user_agent NVARCHAR(255) NULL,

CONSTRAINT FK_RefreshTokens_Accounts FOREIGN KEY (account_id)
    REFERENCES Accounts(account_id)
);

ALTER TABLE Accounts ADD is_deleted bit null;

alter table Threads add thread_post NVarChar(100);

ALTER TABLE Accounts ALTER COLUMN created_at DATETIME2 NOT NULL;

ALTER TABLE Forums ALTER COLUMN created_at DATETIME2 NOT NULL;

ALTER TABLE Threads ALTER COLUMN created_at DATETIME2 NOT NULL;

ALTER TABLE Posts ALTER COLUMN created_at DATETIME2 NOT NULL;

ALTER TABLE Accounts ALTER COLUMN account_name NVARCHAR(100) NOT NULL;

ALTER TABLE Forums ALTER COLUMN forum_name NVARCHAR(100) NOT NULL;

ALTER TABLE Threads ALTER COLUMN thread_name NVARCHAR(100) NOT NULL;

ALTER TABLE Posts ALTER COLUMN post_text NVARCHAR(100) NOT NULL;

ALTER TABLE Accounts ADD CONSTRAINT DF_Accounts_IsDeleted DEFAULT 0 FOR is_deleted;

ALTER TABLE Posts ADD CONSTRAINT DF_Posts_IsDeleted DEFAULT 0 FOR is_deleted;

ALTER TABLE AccountCredentials ADD CONSTRAINT DF_AccountCredentials_IsAdmin DEFAULT 0 FOR isAdmin;

ALTER TABLE Posts ADD CONSTRAINT FK_Posts_Threads FOREIGN KEY (thread_id) REFERENCES Threads(thread_id) ON DELETE CASCADE;

Alter Table Threads ADD CONSTRAINT FK_Threads_Posts FOREIGN KEY (forum_id) references Forums(forum_id) ON DELETE CASCADE;

ALTER TABLE Posts DROP COLUMN post_number;

alter table Posts add post_number INT not null

alter table Posts add constraint PK_thread_num_post_num unique (thread_id, post_number);

alter table accounts add profile_img nvarchar(255) null;



Running the app

To run the api go to the root of the repo then cd to backend_api/backend and run node server.js

To run the frontend got to the root and cd to frontend/my-react-app and run npm run dev.



Organization and Architecture

This project is split into two main parts: The API and the Web application

API:
Tools Used:
Javascript
Node.js
Next.js
Microsoft Sql Server
T-SQL
Docker Desktop
Bcrypt
Bruno
Organization:
The code for the API was split into routes, controllers, models, utils, and middleware. This was done in order to ensure easy access to the different parts of the code and to make it easier to understand on a first look.
The API handles user authorization and in order to ensure secure handling of data and the authenticity of sessions auth token and refresh tokens are used. The auth tokens expire after 15 minutes and the refresh token is used to get a new one. The refresh token expires after 14 days.
Bruno was used to test the API and its different calls as it was being implemented. There are some endpoints that can only be used in Bruno that are not implemented in the frontend. (Deleting forums, threads, accounts, etc.)
Frontend
Tools Used:
React
Javascript
Vite
Organization
The frontend is a Single page application using routes to navigate between the different pages. Reusable assets are made into components in the Components folder in order to reduce redundancy in the code. To access data across the different pages data like user information is stored in a context and accessed/changed in the pages that use it.
