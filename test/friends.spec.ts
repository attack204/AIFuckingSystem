import { expect } from "chai";
import { DELETE, generateFakeAccount, GET, parseCookie, POST, PUT } from "./utils";

describe('friends', () => {

  const user1 = generateFakeAccount();
  const user2 = generateFakeAccount();
  const user3 = generateFakeAccount();
  let cookie1: string;
  let cookie2: string;
  let cookie3: string;

  it('register fake accounts', async () => {
    const res1 = await POST('/api/register', user1);
    const res2 = await POST('/api/register', user2);

    expect(res1.status).eq(200);
    expect(res2.status).eq(200);

    cookie1 = parseCookie(res1.headers);
    cookie2 = parseCookie(res2.headers);
  });

  it('add friend', async () => {
    const res1 = await GET('/api/friends', null, { Cookie: cookie1 });
    expect(res1.status).eq(200);
    expect(res1.data).deep.eq({ status: 200, friends: [] });

    const res2 = await PUT(`/api/friends/${user2.username}`, null, { Cookie: cookie1 });
    expect(res2.status).eq(200);
    expect(res2.data).deep.eq({ status: 200 });

    const res3 = await GET('/api/friends', null, { Cookie: cookie1 });
    expect(res3.status).eq(200);
    expect(res3.data).deep.eq({ status: 200, friends: [user2.username] });

    const res4 = await GET('/api/friends', null, { Cookie: cookie2 });
    expect(res4.status).eq(200);
    expect(res4.data).deep.eq({ status: 200, friends: [user1.username] });
  });

  it('add duplicated friend', async () => {
    const res1 = await PUT(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'friend_already_exists' });
  });

  it('add non-exist friend', async () => {
    const res1 = await PUT(`/api/friends/${user3.username}`, null, { Cookie: cookie1 });
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'user_not_exists' });
  });

  it('get other\'s friend', async () => {
    const res = await GET(`/api/friends/${user2.username}`);
    expect(res.data).deep.eq({ status: 200, friends: [user1.username] });
  });

  it('delete non-exist friend', async () => {
    const res1 = await DELETE(`/api/friends/${user3.username}`, null, { Cookie: cookie2 });
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'user_not_exists' });
  });

  it('delete friend', async () => {
    const res1 = await DELETE(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res1.status).eq(200);
    expect(res1.data).deep.eq({ status: 200 });

    const res2 = await GET('/api/friends', null, { Cookie: cookie1 });
    expect(res2.status).eq(200);
    expect(res2.data).deep.eq({ status: 200, friends: [] });

    const res3 = await GET('/api/friends', null, { Cookie: cookie2 });
    expect(res3.status).eq(200);
    expect(res3.data).deep.eq({ status: 200, friends: [] });
  });

  it('delete non-friend friend', async () => {
    const res1 = await DELETE(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res1.status).eq(400);
    expect(res1.data).deep.eq({ status: 400, error: 'friend_not_exists' });
  });

  it('complex friendship', async () => {
    const res1 = await POST('/api/register', user3);
    expect(res1.status).eq(200);
    cookie3 = parseCookie(res1.headers);

    const res2 = await PUT(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res2.status).eq(200);
    expect(res2.data).deep.eq({ status: 200 });

    const res3 = await PUT(`/api/friends/${user3.username}`, null, { Cookie: cookie2 });
    expect(res3.status).eq(200);
    expect(res3.data).deep.eq({ status: 200 });

    const res4 = await GET(`/api/friends`, null, { Cookie: cookie2 });
    expect(res4.status).eq(200);
    expect(res4.data).deep.eq({ status: 200, friends: [ user1.username, user3.username ] });

    const res5 = await DELETE(`/api/friends/${user1.username}`, null, { Cookie: cookie2 });
    expect(res5.status).eq(200);
    expect(res5.data).deep.eq({ status: 200 });

    const res6 = await GET(`/api/friends`, null, { Cookie: cookie2 });
    expect(res6.status).eq(200);
    expect(res6.data).deep.eq({ status: 200, friends: [ user3.username ] });

    const res7 = await DELETE(`/api/friends/${user2.username}`, null, { Cookie: cookie3 });
    expect(res7.status).eq(200);
    expect(res7.data).deep.eq({ status: 200 });

    const res8 = await GET(`/api/friends`, null, { Cookie: cookie2 });
    expect(res8.status).eq(200);
    expect(res8.data).deep.eq({ status: 200, friends: [] });
  });
});