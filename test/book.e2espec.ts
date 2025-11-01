
import request from 'supertest';
import { getApp } from './setup-e2e';

describe('BookController (e2e)', () => {
  let authorId = '';
  let bookId = '';


  it('/books (POST) creates a book', async () => {
    // 1) Create an author
    const authorRes = await request(getApp().getHttpServer())
      .post('/authors')
      .send({ firstName: 'Test', lastName: 'Author' })
      .expect(201);

    authorId = authorRes.body.data._id;

    // 2) Create a book with that authorId
    const bookRes = await request(getApp().getHttpServer())
      .post('/books')
      .send({
        title: 'Test Book',
        isbn: Math.floor(100 + Math.random() * 900) + '-0-00-000000-0',
        genre: 'Fantasy',
        authorId,
      })
      .expect(201);

    bookId = bookRes.body.data._id;

    // 3) Assert response structure
    expect(bookRes.body).toEqual({
      success: true,
      message: 'Book created successfully',
      data: expect.objectContaining({
        _id: expect.any(String),
        title: 'Test Book',
        isbn: '978-0-00-000000-0',
        genre: 'Fantasy',
        authorId: expect.any(String),
      }),
    });
  });

  // it('/books (GET)', async () => {
  //   const res = await request(getApp().getHttpServer())
  //     .get('/books')
  //     .expect(200);

  //   expect(res.body).toEqual({
  //     success: true,
  //     message: 'Books fetched successfully',
  //     page: expect.any(Number),
  //     limit: expect.any(Number),
  //     total: expect.any(Number),
  //     data: expect.any(Array),
  //   });
  // });


  //   const response = await request(getApp().getHttpServer())
  //     .post('/books')
  //     .send({
  //       title: 'Test Book',
  //       author: 'Test Author',
  //       publicationYear: 2022,
  //     })
  //     .expect(201)

  //   const bookId = response.body.id;

  //   return request(getApp().getHttpServer())
  //     .put(`/books/${bookId}`)
  //     .send({
  //       title: 'Updated Test Book',
  //       author: 'Updated Test Author',
  //       publicationYear: 2023,
  //     })
  //     .expect(200)
  //     .expect({
  //       id: bookId,
  //       title: 'Updated Test Book',
  //       author: 'Updated Test Author',
  //       publicationYear: 2023,
  //     })
  // });

  // it('/books/:id (DELETE)', async () => {
  //   const response = await request(getApp().getHttpServer())
  //     .post('/books')
  //     .send({
  //       title: 'Test Book',
  //       author: 'Test Author',
  //       publicationYear: 2022,
  //     })
  //     .expect(201)

  //   const bookId = response.body.id;

  //   return request(getApp().getHttpServer())
  //     .delete(`/books/${bookId}`)
  //     .expect(200)
  //     .expect({
  //       message: 'Book deleted successfully',
  //     })
  // });
});
