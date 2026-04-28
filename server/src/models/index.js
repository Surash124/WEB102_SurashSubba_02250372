const dataStore = {
  users: [
    {
      id: 1,
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123',
      name: 'User One',
      bio: 'Hello from User 1!',
      followers: [2],
      following: [2],
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      username: 'user2',
      email: 'user2@example.com',
      password: 'password123',
      name: 'User Two',
      bio: 'Hello from User 2!',
      followers: [1],
      following: [1],
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      username: 'user3',
      email: 'user3@example.com',
      password: 'password123',
      name: 'User Three',
      bio: 'Hello from User 3!',
      followers: [],
      following: [],
      createdAt: new Date().toISOString(),
    },
  ],

  videos: [
    {
      id: 1,
      title: 'Check out this cool video! #trending #tiktok #viral',
      description: 'Check out this cool video! #trending #tiktok #viral',
      url: '',
      userId: 1,
      likes: [2],
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Learning to dance #dance #fun #trending',
      description: 'Learning to dance #dance #fun #trending',
      url: '',
      userId: 2,
      likes: [1, 3],
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Beautiful sunset today! #nature #sunset #vibes',
      description: 'Beautiful sunset today! #nature #sunset #vibes',
      url: '',
      userId: 3,
      likes: [],
      createdAt: new Date().toISOString(),
    },
  ],

  comments: [
    {
      id: 1,
      videoId: 1,
      userId: 2,
      text: 'Amazing video!',
      likes: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      videoId: 1,
      userId: 3,
      text: 'So cool!',
      likes: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      videoId: 2,
      userId: 1,
      text: 'Great moves!',
      likes: [],
      createdAt: new Date().toISOString(),
    },
  ],

  nextIds: {
    users: 4,
    videos: 4,
    comments: 4,
  },
};

module.exports = dataStore;
