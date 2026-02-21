# ForumApplication
figma design: https://www.figma.com/design/YZyzvZjWIAt4JsmrKwAI9n/Forum-Webpage?node-id=0-1&t=P0tfZ1Has8oRlKPc-1
db diagram: https://dbdiagram.io/d/Forum-Web-Application-696d5d8ed6e030a024622c97



CREATE TABLE [Accounts] (
  [account_name] nvarchar(100),
  [account_id] int PRIMARY KEY IDENTITY(1, 1),
  [created_at] nvarchar(100)
)
GO

CREATE TABLE [Forums] (
  [forum_name] nvarchar(100),
  [forum_id] int PRIMARY KEY IDENTITY(1, 1),
  [forum_description] nvarchar(100),
  [created_by] int,
  [created_at] nvarchar(100)
)
GO

CREATE TABLE [Threads] (
  [thread_name] nvarchar(100),
  [thread_id] int PRIMARY KEY IDENTITY(1, 1),
  [forum_id] int,
  [created_by] int,
  [created_at] nvarchar(100)
)
GO

CREATE TABLE [Posts] (
  [thread_id] int,
  [account_id] int,
  [post_id] int PRIMARY KEY IDENTITY(1, 1),
  [post_number] int,
  [created_at] nvarchar(100),
  [post_text] nvarchar(100),
  [is_deleted] bit
)
GO

CREATE TABLE [AccountCredentials] (
  [account_id] int PRIMARY KEY,
  [email] nvarchar(100) UNIQUE,
  [password_hash] nvarchar(100),
  [isAdmin] bit
)
GO

ALTER TABLE [Forums] ADD FOREIGN KEY ([created_by]) REFERENCES [Accounts] ([account_id])
GO

ALTER TABLE [Threads] ADD FOREIGN KEY ([forum_id]) REFERENCES [Forums] ([forum_id])
GO

ALTER TABLE [Threads] ADD FOREIGN KEY ([created_by]) REFERENCES [Accounts] ([account_id])
GO

ALTER TABLE [Posts] ADD FOREIGN KEY ([thread_id]) REFERENCES [Threads] ([thread_id])
GO

ALTER TABLE [Posts] ADD FOREIGN KEY ([account_id]) REFERENCES [Accounts] ([account_id])
GO

ALTER TABLE [AccountCredentials] ADD FOREIGN KEY ([account_id]) REFERENCES [Accounts] ([account_id])
GO

CREATE TABLE RefreshTokens (
    refresh_token_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    token_hash NVARCHAR(255) NOT NULL UNIQUE,
    jti NVARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME2 NOT NULL,
    revoked_at DATETIME2 NULL,
    replaced_by NVARCHAR(255) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    ip NVARCHAR(50) NULL,
    user_agent NVARCHAR(255) NULL,

    CONSTRAINT FK_RefreshTokens_Accounts FOREIGN KEY (account_id)
        REFERENCES Accounts(account_id)
);

ALTER TABLE Accounts
ADD is_deleted bit null;

alter table Threads
add thread_post NVarChar(100);

ALTER TABLE Accounts
ALTER COLUMN created_at DATETIME2 NOT NULL;

ALTER TABLE Forums
ALTER COLUMN created_at DATETIME2 NOT NULL;

ALTER TABLE Threads
ALTER COLUMN created_at DATETIME2 NOT NULL;

ALTER TABLE Posts
ALTER COLUMN created_at DATETIME2 NOT NULL;

ALTER TABLE Accounts
ALTER COLUMN account_name NVARCHAR(100) NOT NULL;

ALTER TABLE Forums
ALTER COLUMN forum_name NVARCHAR(100) NOT NULL;

ALTER TABLE Threads
ALTER COLUMN thread_name NVARCHAR(100) NOT NULL;

ALTER TABLE Posts
ALTER COLUMN post_text NVARCHAR(100) NOT NULL;

ALTER TABLE Accounts
ADD CONSTRAINT DF_Accounts_IsDeleted DEFAULT 0 FOR is_deleted;

ALTER TABLE Posts
ADD CONSTRAINT DF_Posts_IsDeleted DEFAULT 0 FOR is_deleted;

ALTER TABLE AccountCredentials
ADD CONSTRAINT DF_AccountCredentials_IsAdmin DEFAULT 0 FOR isAdmin;

ALTER TABLE Posts
ADD CONSTRAINT FK_Posts_Threads
FOREIGN KEY (thread_id)
REFERENCES Threads(thread_id)
ON DELETE CASCADE;

Alter Table Threads
ADD CONSTRAINT FK_Threads_Posts
FOREIGN KEY (forum_id)
references Forums(forum_id)
ON DELETE CASCADE;