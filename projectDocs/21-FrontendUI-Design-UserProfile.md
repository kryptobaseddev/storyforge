<think>I need to create a UI design for user profile features that include social aspects like connections/friends, viewing public stories from friends, account settings, password reset, social network connections, and other profile features.

I'll need to design:
1. User Profile Page with social features
2. Friends/Connections Management
3. Account Settings
4. Social Feed of Friends' Stories
5. Profile Privacy Settings
6. Social Network Connections

I'll use the same ASCII art style as in the previous document to maintain consistency, and ensure the design aligns with the existing UI patterns and components from the StoryForge application.</think>

# StoryForge - User Profile & Social Features UI Design

This document outlines the UI design for user profile and social features in the StoryForge application, including connections management, social feed, account settings, and profile customization.

## Table of Contents

1. [User Profile Page](#user-profile-page)
2. [Connections Management](#connections-management)
3. [Social Feed](#social-feed)
4. [Account Settings](#account-settings)
5. [Profile Privacy Settings](#profile-privacy-settings)
6. [Social Network Connections](#social-network-connections)
7. [Responsive Layouts](#responsive-layouts)

## User Profile Page

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├─────────────┬───────────────────────────────┬───────────────┤
│             │ ┌───────────────────────────┐ │               │
│  NAVIGATION │ │ USER PROFILE              │ │  ACTIVITY     │
│             │ └───────────────────────────┘ │  FEED         │
│             │                               │               │
│             │ ┌───────────┐ ┌─────────────┐ │ ┌─────────────┐
│             │ │           │ │ Username    │ │ │ RECENT      │
│             │ │  AVATAR   │ │ @handle     │ │ │ ACTIVITY    │
│             │ │           │ │             │ │ │             │
│             │ │ [Change]  │ │ Bio text... │ │ │ • Updated   │
│             │ │           │ │             │ │ │   Project X │
│             │ └───────────┘ │ [Edit]      │ │ │   2d ago    │
│             │               └─────────────┘ │ │             │
│             │                               │ │ • Created   │
│             │ ┌───────────────────────────┐ │ │   Character │
│             │ │ [Profile] [Stories] [Connections] [Settings]│ │   3d ago    │
│             │ └───────────────────────────┘ │ │             │
│             │                               │ │ • Shared    │
│             │ ┌───────────────────────────┐ │ │   Story Y   │
│             │ │                           │ │ │   1w ago    │
│             │ │     PUBLIC STORIES        │ │ │             │
│             │ │                           │ │ └─────────────┘
│             │ │ ┌─────┐ ┌─────┐ ┌─────┐   │ │               │
│             │ │ │Story│ │Story│ │Story│   │ │ ┌─────────────┐
│             │ │ │  1  │ │  2  │ │  3  │   │ │ │ STATS       │
│             │ │ └─────┘ └─────┘ └─────┘   │ │ │             │
│             │ │                           │ │ │ Stories: 12  │
│             │ │ [View All Stories]        │ │ │ Connections: │
│             │ └───────────────────────────┘ │ │ 24          │
│             │                               │ │             │
│             │                               │ │ Joined:     │
│             │                               │ │ Jan 2023    │
│             │                               │ └─────────────┘
├─────────────┴───────────────────────────────┴───────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────┐
│           HEADER            │
│ [Menu]           [Settings] │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │         AVATAR          │ │
│ │        [Change]         │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Username                │ │
│ │ @handle                 │ │
│ │                         │ │
│ │ Bio text...             │ │
│ │                         │ │
│ │ [Edit Profile]          │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Stories: 12  Connect: 24 │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │[Profile][Stories][Connect]│ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │     PUBLIC STORIES      │ │
│ │                         │ │
│ │ ┌─────┐    ┌─────┐      │ │
│ │ │Story│    │Story│      │ │
│ │ │  1  │    │  2  │      │ │
│ │ └─────┘    └─────┘      │ │
│ │                         │ │
│ │ [View All]              │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │     RECENT ACTIVITY     │ │
│ │ • Updated Project X     │ │
│ │ • Created Character     │ │
│ │ • Shared Story Y        │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│      [Home] [Profile]       │
└─────────────────────────────┘
```

## Connections Management

### Connections List (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├─────────────┬───────────────────────────────┬───────────────┤
│             │ ┌───────────────────────────┐ │               │
│  NAVIGATION │ │ CONNECTIONS               │ │  CONNECTION   │
│             │ └───────────────────────────┘ │  SUGGESTIONS  │
│             │                               │               │
│             │ ┌───────────────────────────┐ │ ┌─────────────┐
│             │ │ [Search] [Filter] [Sort]  │ │ │ PEOPLE YOU  │
│             │ └───────────────────────────┘ │ │ MAY KNOW    │
│             │                               │ │             │
│             │ ┌───────────────────────────┐ │ │ ┌─────────┐ │
│             │ │ CONNECTIONS (24)          │ │ │ │User 1   │ │
│             │ │                           │ │ │ │[Connect]│ │
│             │ │ ┌─────────┐ ┌─────────┐   │ │ │ └─────────┘ │
│             │ │ │User A   │ │User B   │   │ │ │             │
│             │ │ │[Message]│ │[Message]│   │ │ │ ┌─────────┐ │
│             │ │ │[Remove] │ │[Remove] │   │ │ │ │User 2   │ │
│             │ │ └─────────┘ └─────────┘   │ │ │ │[Connect]│ │
│             │ │                           │ │ │ └─────────┘ │
│             │ │ ┌─────────┐ ┌─────────┐   │ │ │             │
│             │ │ │User C   │ │User D   │   │ │ │ ┌─────────┐ │
│             │ │ │[Message]│ │[Message]│   │ │ │ │User 3   │ │
│             │ │ │[Remove] │ │[Remove] │   │ │ │ │[Connect]│ │
│             │ │ └─────────┘ └─────────┘   │ │ │ └─────────┘ │
│             │ │                           │ │ │             │
│             │ │ [Load More]               │ │ │ [See More]  │
│             │ └───────────────────────────┘ │ └─────────────┘
│             │                               │               │
│             │ ┌───────────────────────────┐ │ ┌─────────────┐
│             │ │ PENDING REQUESTS (3)      │ │ │ FIND PEOPLE │
│             │ │                           │ │ │             │
│             │ │ ┌─────────┐ ┌─────────┐   │ │ │ [Search by  │
│             │ │ │User X   │ │User Y   │   │ │ │  email]     │
│             │ │ │[Accept] │ │[Accept] │   │ │ │             │
│             │ │ │[Decline]│ │[Decline]│   │ │ │ [Import     │
│             │ │ └─────────┘ └─────────┘   │ │ │  contacts]  │
│             │ └───────────────────────────┘ │ └─────────────┘
├─────────────┴───────────────────────────────┴───────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

### Connection Profile (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├─────────────┬───────────────────────────────┬───────────────┤
│             │ ┌───────────────────────────┐ │               │
│  NAVIGATION │ │ USER: {Username}          │ │  SHARED       │
│             │ │ [< Back] [Message]        │ │  PROJECTS     │
│             │                               │               │
│             │ ┌───────────┐ ┌─────────────┐ │ ┌─────────────┐
│             │ │           │ │ Username    │ │ │ PROJECTS    │
│             │ │  AVATAR   │ │ @handle     │ │ │ YOU BOTH    │
│             │ │           │ │             │ │ │ WORK ON     │
│             │ │           │ │ Bio text... │ │ │             │
│             │ │           │ │             │ │ │ • Project A │
│             │ └───────────┘ │ Connected   │ │ │             │
│             │               │ since Jan 23│ │ │ • Project B │
│             │               └─────────────┘ │ │             │
│             │                               │ │             │
│             │ ┌───────────────────────────┐ │ └─────────────┘
│             │ │ [Profile] [Stories] [Mutual Connections]   ││ │               │
│             │ └───────────────────────────┘ │ ┌─────────────┐
│             │                               │ │ ACTIONS     │
│             │ ┌───────────────────────────┐ │ │             │
│             │ │                           │ │ │ [Remove     │
│             │ │     PUBLIC STORIES        │ │ │  Connection]│
│             │ │                           │ │ │             │
│             │ │ ┌─────┐ ┌─────┐ ┌─────┐   │ │ │ [Block User]│
│             │ │ │Story│ │Story│ │Story│   │ │ │             │
│             │ │ │  1  │ │  2  │ │  3  │   │ │ │ [Report]    │
│             │ │ └─────┘ └─────┘ └─────┘   │ │ │             │
│             │ │                           │ │ │             │
│             │ │ [View All Stories]        │ │ │             │
│             │ └───────────────────────────┘ │ └─────────────┘
│             │                               │               │
├─────────────┴───────────────────────────────┴───────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

## Social Feed

### Social Feed (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├─────────────┬───────────────────────────────┬───────────────┤
│             │ ┌───────────────────────────┐ │               │
│  NAVIGATION │ │ SOCIAL FEED               │ │  TRENDING     │
│             │ └───────────────────────────┘ │  STORIES      │
│             │                               │               │
│             │ ┌───────────────────────────┐ │ ┌─────────────┐
│             │ │ [All] [Stories] [Updates] │ │ │ POPULAR     │
│             │ └───────────────────────────┘ │ │ THIS WEEK   │
│             │                               │ │             │
│             │ ┌───────────────────────────┐ │ │ 1. Story X  │
│             │ │ ┌─────┐ User A            │ │ │    by User M│
│             │ │ │     │ shared a new story│ │ │             │
│             │ │ │     │ 2h ago            │ │ │ 2. Story Y  │
│             │ │ └─────┘                   │ │ │    by User N│
│             │ │ "Story Title"             │ │ │             │
│             │ │ Story preview text...     │ │ │ 3. Story Z  │
│             │ │                           │ │ │    by User O│
│             │ │ [Read] [Like] [Comment]   │ │ │             │
│             │ └───────────────────────────┘ │ │ [See All]   │
│             │                               │ └─────────────┘
│             │ ┌───────────────────────────┐ │               │
│             │ │ ┌─────┐ User B            │ │ ┌─────────────┐
│             │ │ │     │ updated Project C │ │ │ WRITING     │
│             │ │ │     │ 4h ago            │ │ │ CHALLENGES  │
│             │ │ └─────┘                   │ │ │             │
│             │ │ Added 3 new characters    │ │ │ Weekly      │
│             │ │ to "Project Title"        │ │ │ Challenge:  │
│             │ │                           │ │ │ "Theme"     │
│             │ │ [View] [Like] [Comment]   │ │ │             │
│             │ └───────────────────────────┘ │ │ [Join]      │
│             │                               │ └─────────────┘
│             │ ┌───────────────────────────┐ │               │
│             │ │ ┌─────┐ User C            │ │ ┌─────────────┐
│             │ │ │     │ completed a story │ │ │ SUGGESTED   │
│             │ │ │     │ 1d ago            │ │ │ CONNECTIONS │
│             │ │ └─────┘                   │ │ │             │
│             │ │ "Story Title" is now      │ │ │ [View All]  │
│             │ │ available to read!        │ │ │             │
│             │ │                           │ │ └─────────────┘
│             │ │ [Read] [Like] [Comment]   │ │               │
│             │ └───────────────────────────┘ │               │
│             │                               │               │
│             │ [Load More]                   │               │
├─────────────┴───────────────────────────────┴───────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Social Feed

```
┌─────────────────────────────┐
│           HEADER            │
│ [Menu]           [Profile]  │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ SOCIAL FEED             │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │[All] [Stories] [Updates]│ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ┌─────┐ User A          │ │
│ │ │     │ shared a story  │ │
│ │ │     │ 2h ago          │ │
│ │ └─────┘                 │ │
│ │ "Story Title"           │ │
│ │ Story preview text...   │ │
│ │                         │ │
│ │ [Read] [Like] [Comment] │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ┌─────┐ User B          │ │
│ │ │     │ updated Project │ │
│ │ │     │ 4h ago          │ │
│ │ └─────┘                 │ │
│ │ Added 3 new characters  │ │
│ │ to "Project Title"      │ │
│ │                         │ │
│ │ [View] [Like] [Comment] │ │
│ └─────────────────────────┘ │
│                             │
│ [Load More]                 │
│                             │
│ ┌─────────────────────────┐ │
│ │ TRENDING STORIES        │ │
│ │ 1. Story X by User M    │ │
│ │ 2. Story Y by User N    │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│[Home][Feed][Create][Profile]│
└─────────────────────────────┘
```

## Account Settings

### Account Settings (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├─────────────┬───────────────────────────────┬───────────────┤
│             │ ┌───────────────────────────┐ │               │
│  NAVIGATION │ │ ACCOUNT SETTINGS          │ │  HELP &       │
│             │ └───────────────────────────┘ │  SUPPORT      │
│             │                               │               │
│             │ ┌───────────────────────────┐ │ ┌─────────────┐
│             │ │ [Profile] [Account] [Privacy] [Notifications]│ │ HELP CENTER │
│             │ └───────────────────────────┘ │ │             │
│             │                               │ │ • FAQs      │
│             │ ┌───────────────────────────┐ │ │             │
│             │ │ ACCOUNT INFORMATION       │ │ │ • Tutorials │
│             │ │                           │ │ │             │
│             │ │ Email:                    │ │ │ • Contact   │
│             │ │ user@example.com [Change] │ │ │   Support   │
│             │ │                           │ │ │             │
│             │ │ Password:                 │ │ └─────────────┘
│             │ │ ********** [Change]       │ │               │
│             │ │                           │ │ ┌─────────────┐
│             │ │ Username:                 │ │ │ ACCOUNT     │
│             │ │ @username [Change]        │ │ │ SECURITY    │
│             │ │                           │ │ │             │
│             │ │ Language:                 │ │ │ Last login: │
│             │ │ English [Change]          │ │ │ May 15, 2023│
│             │ │                           │ │ │             │
│             │ │ Time Zone:                │ │ │ Devices:    │
│             │ │ UTC-5 [Change]            │ │ │ [Manage]    │
│             │ └───────────────────────────┘ │ │             │
│             │                               │ │ Sessions:   │
│             │ ┌───────────────────────────┐ │ │ [View]      │
│             │ │ CONNECTED ACCOUNTS        │ │ │             │
│             │ │                           │ │ └─────────────┘
│             │ │ Google:                   │ │               │
│             │ │ Connected [Disconnect]    │ │               │
│             │ │                           │ │               │
│             │ │ Facebook:                 │ │               │
│             │ │ Not connected [Connect]   │ │               │
│             │ │                           │ │               │
│             │ │ Twitter:                  │ │               │
│             │ │ Not connected [Connect]   │ │               │
│             │ └───────────────────────────┘ │               │
│             │                               │               │
│             │ ┌───────────────────────────┐ │               │
│             │ │ DANGER ZONE               │ │               │
│             │ │                           │ │               │
│             │ │ [Deactivate Account]      │ │               │
│             │ │ [Delete Account]          │ │               │
│             │ └───────────────────────────┘ │               │
├─────────────┴───────────────────────────────┴───────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

### Change Password Dialog

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│     ┌─────────────────────────────────────────────┐         │
│     │           CHANGE PASSWORD                  │         │
│     ├─────────────────────────────────────────────┤         │
│     │                                             │         │
│     │  Current Password:                          │         │
│     │  [••••••••••••••]                          │         │
│     │                                             │         │
│     │  New Password:                              │         │
│     │  [                ]                         │         │
│     │  Password strength: ■■■□□ Medium            │         │
│     │                                             │         │
│     │  Confirm New Password:                      │         │
│     │  [                ]                         │         │
│     │                                             │         │
│     │  [Cancel]                      [Save]       │         │
│     │                                             │         │
│     └─────────────────────────────────────────────┘         │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Profile Privacy Settings

### Privacy Settings (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├─────────────┬───────────────────────────────┬───────────────┤
│             │ ┌───────────────────────────┐ │               │
│  NAVIGATION │ │ PRIVACY SETTINGS          │ │  PRIVACY      │
│             │ └───────────────────────────┘ │  TIPS         │
│             │                               │               │
│             │ ┌───────────────────────────┐ │ ┌─────────────┐
│             │ │ [Profile] [Account] [Privacy] [Notifications]│ │ PROTECTING  │
│             │ └───────────────────────────┘ │ │ YOUR DATA   │
│             │                               │ │             │
│             │ ┌───────────────────────────┐ │ │ • Use a     │
│             │ │ PROFILE VISIBILITY        │ │ │   strong    │
│             │ │                           │ │ │   password  │
│             │ │ Who can see your profile: │ │ │             │
│             │ │ ○ Everyone                │ │ │ • Enable    │
│             │ │ ○ Connections only        │ │ │   two-factor│
│             │ │ ○ Nobody                  │ │ │   auth      │
│             │ │                           │ │ │             │
│             │ │ Who can see your stories: │ │ │ • Review    │
│             │ │ ○ Everyone                │ │ │   privacy   │
│             │ │ ○ Connections only        │ │ │   settings  │
│             │ │ ○ Nobody                  │ │ │   regularly │
│             │ │                           │ │ │             │
│             │ │ Show activity status:     │ │ └─────────────┘
│             │ │ [ON/OFF]                  │ │               │
│             │ └───────────────────────────┘ │               │
│             │                               │               │
│             │ ┌───────────────────────────┐ │               │
│             │ │ CONNECTION REQUESTS       │ │               │
│             │ │                           │ │               │
│             │ │ Who can send you requests:│ │               │
│             │ │ ○ Everyone                │ │               │
│             │ │ ○ Connections of connections│ │               │
│             │ │ ○ Nobody                  │ │               │
│             │ │                           │ │               │
│             │ │ Auto-decline requests from:│ │               │
│             │ │ ☑ New accounts (<30 days) │ │               │
│             │ │ ☑ Accounts with no stories│ │               │
│             │ └───────────────────────────┘ │               │
│             │                               │               │
│             │ ┌───────────────────────────┐ │               │
│             │ │ BLOCKED ACCOUNTS          │ │               │
│             │ │                           │ │               │
│             │ │ You have blocked 2 accounts│ │               │
│             │ │                           │ │               │
│             │ │ [Manage Blocked Accounts] │ │               │
│             │ └───────────────────────────┘ │               │
│             │                               │               │
│             │ [Save Changes]                │               │
├─────────────┴───────────────────────────────┴───────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

## Social Network Connections

### Social Network Integration (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├─────────────┬───────────────────────────────┬───────────────┤
│             │ ┌───────────────────────────┐ │               │
│  NAVIGATION │ │ SOCIAL CONNECTIONS        │ │  BENEFITS     │
│             │ └───────────────────────────┘ │               │
│             │                               │               │
│             │ ┌───────────────────────────┐ │ ┌─────────────┐
│             │ │ CONNECTED ACCOUNTS        │ │ │ WHY CONNECT │
│             │ │                           │ │ │             │
│             │ │ Connect your social media │ │ │ • Find      │
│             │ │ accounts to enhance your  │ │ │   friends   │
│             │ │ StoryForge experience.    │ │ │   easily    │
│             │ │                           │ │ │             │
│             │ │ ┌─────────────────────┐   │ │ │ • Share     │
│             │ │ │ Google              │   │ │ │   stories   │
│             │ │ │ Connected as:       │   │ │ │   across    │
│             │ │ │ user@gmail.com      │   │ │ │   platforms │
│             │ │ │ [Disconnect]        │   │ │ │             │
│             │ │ └─────────────────────┘   │ │ │             │
│             │ │ ┌─────────────────────┐   │ │ │ • Import    │
│             │ │ │ GitHub              │   │ │ │   contacts  │
│             │ │ │ Connected as:       │   │ │ │             │
│             │ │ │ user@gmail.com      │   │ │ │ • Seamless  │
│             │ │ │ [Disconnect]        │   │ │ │   login     │
│             │ │ └─────────────────────┘   │ │ │             │
│             │ │                           │ │ └─────────────┘
│             │ │ ┌─────────────────────┐   │ │               │
│             │ │ │ Facebook            │   │ │ ┌─────────────┐
│             │ │ │ Not connected       │   │ │ │ PRIVACY     │
│             │ │ │ [Connect]           │   │ │ │ NOTICE      │
│             │ │ └─────────────────────┘   │ │ │             │
│             │ │                           │ │ │ We only     │
│             │ │ ┌─────────────────────┐   │ │ │ access data │
│             │ │ │ Twitter (X)         │   │ │ │ you         │
│             │ │ │ Not connected       │   │ │ │ explicitly  │
│             │ │ │ [Connect]           │   │ │ │ approve.    │
│             │ │ └─────────────────────┘   │ │ │             │
│             │ │                           │ │ │ [Learn More]│
│             │ │ ┌─────────────────────┐   │ │ │             │
│             │ │ │ Discord             │   │ │ └─────────────┘
│             │ │ │ Not connected       │   │ │               │
│             │ │ │ [Connect]           │   │ │               │
│             │ │ └─────────────────────┘   │ │               │
│             │ └───────────────────────────┘ │               │
│             │                               │               │
│             │ ┌───────────────────────────┐ │               │
│             │ │ SHARING SETTINGS          │ │               │
│             │ │                           │ │               │
│             │ │ Auto-share new stories:   │ │               │
│             │ │ ☐ Facebook               │ │               │
│             │ │ ☐ Twitter (X)             │ │               │
│             │ │ ☐ LinkedIn               │ │               │
│             │ │ ☐ Instagram              │ │               │
│             │ │                           │ │               │
│             │ │ Show connected accounts   │ │               │
│             │ │ on profile:               │ │               │
│             │ │ [ON/OFF]                  │ │               │
│             │ └───────────────────────────┘ │               │
│             │                               │               │
│             │ [Save Preferences]            │               │
├─────────────┴───────────────────────────────┴───────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

### Find Friends from Social Networks (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├─────────────┬───────────────────────────────┬───────────────┤
│             │ ┌───────────────────────────┐ │               │
│  NAVIGATION │ │ FIND FRIENDS              │ │  IMPORT       │
│             │ └───────────────────────────┘ │  OPTIONS      │
│             │                               │               │
│             │ ┌───────────────────────────┐ │ ┌─────────────┐
│             │ │ FIND PEOPLE YOU KNOW      │ │ │ IMPORT FROM │
│             │ │                           │ │ │             │
│             │ │ We found 15 people you    │ │ │ • Google    │
│             │ │ may know from your        │ │ │   Contacts  │
│             │ │ connected accounts.       │ │ │             │
│             │ │                           │ │ │ • Email     │
│             │ │ ┌─────────┐ ┌─────────┐   │ │ │   Contacts  │
│             │ │ │User A   │ │User B   │   │ │ │             │
│             │ │ │Facebook │ │Google   │   │ │ │ • CSV File  │
│             │ │ │[Connect]│ │[Connect]│   │ │ │   Upload    │
│             │ │ └─────────┘ └─────────┘   │ │ │             │
│             │ │                           │ │ │ [Start      │
│             │ │ ┌─────────┐ ┌─────────┐   │ │ │ Import]     │
│             │ │ │User C   │ │User D   │   │ │ │             │
│             │ │ │Twitter  │ │Facebook │   │ │ └─────────────┘
│             │ │ │[Connect]│ │[Connect]│   │ │               │
│             │ │ └─────────┘ └─────────┘   │ │ ┌─────────────┐
│             │ │                           │ │ │ INVITE      │
│             │ │ [Connect All] [Skip All]  │ │ │ FRIENDS     │
│             │ │                           │ │ │             │
│             │ │ [Load More]               │ │ │ [Invite via │
│             │ └───────────────────────────┘ │ │  Email]     │
│             │                               │ │             │
│             │ ┌───────────────────────────┐ │ │ [Share      │
│             │ │ SEARCH BY NAME OR EMAIL   │ │ │  Invite     │
│             │ │                           │ │ │  Link]      │
│             │ │ [___________________]     │ │ │             │
│             │ │                           │ │ └─────────────┘
│             │ │ [Search]                  │ │               │
│             │ └───────────────────────────┘ │               │
│             │                               │               │
├─────────────┴───────────────────────────────┴───────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

## Notification Settings

### Notification Preferences (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├─────────────┬───────────────────────────────┬───────────────┤
│             │ ┌───────────────────────────┐ │               │
│  NAVIGATION │ │ NOTIFICATION SETTINGS     │ │  NOTIFICATION │
│             │ └───────────────────────────┘ │  SUMMARY      │
│             │                               │               │
│             │ ┌───────────────────────────┐ │ ┌─────────────┐
│             │ │ [Profile] [Account] [Privacy] [Notifications]│ │ RECENT      │
│             │ └───────────────────────────┘ │ │ NOTIFICATIONS│
│             │                               │ │             │
│             │ ┌───────────────────────────┐ │ │ • Connection│
│             │ │ DELIVERY PREFERENCES      │ │ │   request   │
│             │ │                           │ │ │   (2h ago)  │
│             │ │ Email notifications:      │ │ │             │
│             │ │ [ON/OFF]                  │ │ │ • Story     │
│             │ │                           │ │ │   comment   │
│             │ │ Push notifications:       │ │ │   (1d ago)  │
│             │ │ [ON/OFF]                  │ │ │             │
│             │ │                           │ │ │ [View All]  │
│             │ │ In-app notifications:     │ │ │             │
│             │ │ [ON/OFF]                  │ │ └─────────────┘
│             │ └───────────────────────────┘ │               │
│             │                               │               │
│             │ ┌───────────────────────────┐ │               │
│             │ │ NOTIFICATION TYPES        │ │               │
│             │ │                           │ │               │
│             │ │ Connection requests:      │ │               │
│             │ │ ☑ Email ☑ Push ☑ In-app  │ │               │
│             │ │                           │ │               │
│             │ │ New messages:             │ │               │
│             │ │ ☑ Email ☑ Push ☑ In-app  │ │               │
│             │ │                           │ │               │
│             │ │ Story comments:           │ │               │
│             │ │ ☑ Email ☑ Push ☑ In-app  │ │               │
│             │ │                           │ │               │
│             │ │ Story likes:              │ │               │
│             │ │ ☐ Email ☑ Push ☑ In-app  │ │               │
│             │ │                           │ │               │
│             │ │ Project updates:          │ │               │
│             │ │ ☑ Email ☑ Push ☑ In-app  │ │               │
│             │ │                           │ │               │
│             │ │ Writing challenges:       │ │               │
│             │ │ ☑ Email ☐ Push ☑ In-app  │ │               │
│             │ │                           │ │               │
│             │ │ Marketing & promotions:   │ │               │
│             │ │ ☐ Email ☐ Push ☐ In-app  │ │               │
│             │ └───────────────────────────┘ │               │
│             │                               │               │
│             │ ┌───────────────────────────┐ │               │
│             │ │ QUIET HOURS               │ │               │
│             │ │                           │ │               │
│             │ │ Enable quiet hours:       │ │               │
│             │ │ [ON/OFF]                  │ │               │
│             │ │                           │ │               │
│             │ │ From: [10:00 PM]          │ │               │
│             │ │ To:   [7:00 AM]           │ │               │
│             │ │                           │ │               │
│             │ │ Time zone: UTC-5          │ │               │
│             │ └───────────────────────────┘ │               │
│             │                               │               │
│             │ [Save Preferences]            │               │
├─────────────┴───────────────────────────────┴───────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

## Responsive Layouts

### Mobile Profile Settings

```
┌─────────────────────────────┐
│           HEADER            │
│ [Back]        [Save Changes]│
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ SETTINGS                │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │[Profile][Account][Privacy]│ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ACCOUNT INFORMATION     │ │
│ │                         │ │
│ │ Email:                  │ │
│ │ user@example.com        │ │
│ │ [Change]                │ │
│ │                         │ │
│ │ Password:               │ │
│ │ ********                │ │
│ │ [Change]                │ │
│ │                         │ │
│ │ Username:               │ │
│ │ @username               │ │
│ │ [Change]                │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ CONNECTED ACCOUNTS      │ │
│ │                         │ │
│ │ Google: Connected       │ │
│ │ [Disconnect]            │ │
│ │                         │ │
│ │ Facebook: Not connected │ │
│ │ [Connect]               │ │
│ │                         │ │
│ │ Twitter: Not connected  │ │
│ │ [Connect]               │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ DANGER ZONE             │ │
│ │                         │ │
│ │ [Deactivate Account]    │ │
│ │ [Delete Account]        │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│      [Home] [Profile]       │
└─────────────────────────────┘
```

### Mobile Connections List

```
┌─────────────────────────────┐
│           HEADER            │
│ [Back]          [Search]    │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ CONNECTIONS             │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ [All] [Pending] [Find]  │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ CONNECTIONS (24)        │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ┌─────┐ User A          │ │
│ │ │     │                 │ │
│ │ └─────┘ [Message] [•••] │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ┌─────┐ User B          │ │
│ │ │     │                 │ │
│ │ └─────┘ [Message] [•••] │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ┌─────┐ User C          │ │
│ │ │     │                 │ │
│ │ └─────┘ [Message] [•••] │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ┌─────┐ User D          │ │
│ │ │     │                 │ │
│ │ └─────┘ [Message] [•••] │ │
│ └─────────────────────────┘ │
│                             │
│ [Load More]                 │
├─────────────────────────────┤
│[Home][Connect][Message][Me] │
└─────────────────────────────┘
```

## Messaging Interface

### Direct Messages (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├─────────────┬───────────────────────────────┬───────────────┤
│             │ ┌───────────────────────────┐ │               │
│  NAVIGATION │ │ MESSAGES                  │ │  SHARED       │
│             │ └───────────────────────────┘ │  CONTENT      │
│             │                               │               │
│  CONTACTS   │ ┌───────────────────────────┐ │ ┌─────────────┐
│             │ │ User A                    │ │ │ SHARED      │
│  ┌─────┐    │ │ [Call] [Video] [Info]     │ │ │ STORIES     │
│  │User │    │ └───────────────────────────┘ │ │             │
│  │  A  │    │                               │ │ • Story 1   │
│  └─────┘    │ ┌───────────────────────────┐ │ │             │
│             │ │                           │ │ │ • Story 2   │
│  ┌─────┐    │ │  ┌─────┐                  │ │ │             │
│  │User │    │ │  │     │ User A           │ │ └─────────────┘
│  │  B  │    │ │  └─────┘ 10:30 AM         │ │               │
│  └─────┘    │ │  Hi there! I just read    │ │ ┌─────────────┐
│             │ │  your latest story and    │ │ │ SHARED      │
│  ┌─────┐    │ │  loved it!                │ │ │ PROJECTS    │
│  │User │    │ │                           │ │ │             │
│  │  C  │    │ │                           │ │ │ • Project X │
│  └─────┘    │ │          You  ┌─────┐     │ │ │             │
│             │ │          11:45 AM │     │ │ │ │ [View All]  │
│  ┌─────┐    │ │          Thanks! I'm │     │ │ │             │
│  │User │    │ │          working on  │     │ │ └─────────────┘
│  │  D  │    │ │          the sequel  │     │ │               │
│  └─────┘    │ │          now.        └─────┘ │ │ ┌─────────────┐
│             │ │                           │ │ │ WRITING     │
│  [New       │ │  ┌─────┐                  │ │ │ PROMPTS     │
│   Message]  │ │  │     │ User A           │ │ │             │
│             │ │  └─────┘ 11:50 AM         │ │ │ [Generate   │
│             │ │  That's exciting! Can I   │ │ │  Prompt]    │
│             │ │  get a sneak peek?        │ │ │             │
│             │ │                           │ │ └─────────────┘
│             │ │                           │ │               │
│             │ │                           │ │               │
│             │ │                           │ │               │
│             │ │                           │ │               │
│             │ │                           │ │               │
│             │ └───────────────────────────┘ │               │
│             │                               │               │
│             │ ┌───────────────────────────┐ │               │
│             │ │ [📎] [Message text...   ] │ │               │
│             │ │                    [Send] │ │               │
│             │ └───────────────────────────┘ │               │
├─────────────┴───────────────────────────────┴───────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Messages

```
┌─────────────────────────────┐
│           HEADER            │
│ [Back]     [User A]  [Info] │
├─────────────────────────────┤
│                             │
│                             │
│  ┌─────┐                    │
│  │     │ User A             │
│  └─────┘ 10:30 AM           │
│  Hi there! I just read      │
│  your latest story and      │
│  loved it!                  │
│                             │
│                             │
│            You  ┌─────┐     │
│            11:45 AM │     │ │
│            Thanks! I'm │     │
│            working on  │     │
│            the sequel  │     │
│            now.        └─────┘ │
│                             │
│  ┌─────┐                    │
│  │     │ User A             │
│  └─────┘ 11:50 AM           │
│  That's exciting! Can I     │
│  get a sneak peek?          │
│                             │
│                             │
│                             │
│                             │
│                             │
│                             │
│                             │
│                             │
│                             │
│ ┌─────────────────────────┐ │
│ │[📎][Message text...][➤]│ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│[Home][Connect][Message][Me] │
└─────────────────────────────┘
```

## Story Sharing Settings

### Story Privacy & Sharing (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├─────────────┬───────────────────────────────┬───────────────┤
│             │ ┌───────────────────────────┐ │               │
│  NAVIGATION │ │ STORY: {Title}            │ │  SHARING      │
│             │ │ [< Back] [Save]           │ │  OPTIONS      │
│             │ └───────────────────────────┘ │               │
│             │                               │ ┌─────────────┐
│             │ ┌───────────────────────────┐ │ │ SHARE TO    │
│             │ │ PRIVACY SETTINGS          │ │ │             │
│             │ │                           │ │ │ [Facebook]  │
│             │ │ Who can see this story:   │ │ │             │
│             │ │ ○ Public                  │ │ │ [Twitter]   │
│             │ │ ○ Connections only        │ │ │             │
│             │ │ ○ Private                 │ │ │ [Email]     │
│             │ │                           │ │ │             │
│             │ │ Allow comments:           │ │ │ [Copy Link] │
│             │ │ [ON/OFF]                  │ │ │             │
│             │ │                           │ │ └─────────────┘
│             │ │ Show in your profile:     │ │               │
│             │ │ [ON/OFF]                  │ │ ┌─────────────┐
│             │ │                           │ │ │ EMBED       │
│             │ │ Include in search results:│ │ │ OPTIONS     │
│             │ │ [ON/OFF]                  │ │ │             │
│             │ └───────────────────────────┘ │ │ [Get Embed  │
│             │                               │ │  Code]      │
│             │ ┌───────────────────────────┐ │ │             │
│             │ │ SHARING PERMISSIONS       │ │ │ Size:       │
│             │ │                           │ │ │ [Medium ▼]  │
│             │ │ Allow others to share:    │ │ │             │
│             │ │ [ON/OFF]                  │ │ └─────────────┘
│             │ │                           │ │               │
│             │ │ Allow republishing:       │ │ ┌─────────────┐
│             │ │ [ON/OFF]                  │ │ │ VISIBILITY  │
│             │ │                           │ │ │ SUMMARY     │
│             │ │ Copyright notice:         │ │ │             │
│             │ │ [___________________]     │ │ │ This story  │
│             │ │                           │ │ │ will be     │
│             │ │ Attribution required:     │ │ │ visible to: │
│             │ │ [ON/OFF]                  │ │ │             │
│             │ └───────────────────────────┘ │ │ Connections │
│             │                               │ │ only        │
│             │ ┌───────────────────────────┐ │ │             │
│             │ │ SPECIFIC CONNECTIONS      │ │ │ Comments:   │
│             │ │                           │ │ │ Enabled     │
│             │ │ Share with specific       │ │ │             │
│             │ │ connections:              │ │ │ Sharing:    │
│             │ │ [ON/OFF]                  │ │ │ Allowed     │
│             │ │                           │ │ │             │
│             │ │ [Select Connections]      │ │ └─────────────┘
│             │ └───────────────────────────┘ │               │
│             │                               │               │
├─────────────┴───────────────────────────────┴───────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

This comprehensive UI design for user profile and social features in StoryForge provides detailed layouts for all the key screens and components needed to implement the social aspects of the platform. The design includes:

1. **User Profile Page** - Showcasing user information, public stories, activity feed, and stats
2. **Connections Management** - For managing friends/connections, viewing connection profiles, and handling requests
3. **Social Feed** - Displaying stories and updates from connections
4. **Account Settings** - For managing account information, password, and connected accounts
5. **Profile Privacy Settings** - Controlling visibility and connection requests
6. **Social Network Connections** - Integration with external social networks
7. **Messaging Interface** - For direct communication between users
8. **Story Sharing Settings** - Controlling how stories are shared and with whom

The designs maintain consistency with the existing StoryForge UI patterns and follow responsive design principles to ensure a good experience across desktop, tablet, and mobile devices. Each screen includes appropriate controls for privacy and sharing preferences, aligning with modern social platform expectations while focusing on the storytelling aspects of the application.
