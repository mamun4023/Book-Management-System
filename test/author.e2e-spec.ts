import request from 'supertest';
import { getApp } from './setup-e2e';

describe('AuthorController (e2e)', () => {
    let authorId = '';
    it('/authors (POST) creates an author', async () => {
        const res = await request(getApp().getHttpServer())
            .post('/authors')
            .send({ firstName: 'Test', lastName: 'Author' })
            .expect(201);

        authorId = res.body.data._id;
        expect(res.body).toEqual({
            success: true,
            message: 'Author created successfully',
            data: expect.objectContaining({
                _id: expect.any(String),
                firstName: 'Test',
                lastName: 'Author',
            }),
        });
    });

    it('/authors (GET)', async () => {
        const res = await request(getApp().getHttpServer())
            .get('/authors')
            .expect(200);

        expect(res.body).toEqual({
            success: true,
            message: 'Authors fetched successfully',
            page: expect.any(Number),
            limit: expect.any(Number),
            total: expect.any(Number),
            data: expect.any(Array),
        });
    });

    it('/authors/:id (GET)', async () => {
        const res = await request(getApp().getHttpServer())
            .get(`/authors/${authorId}`)
            .expect(200);

        expect(res.body).toEqual({
            success: true,
            message: 'Author found successfully',
            data: expect.objectContaining({
                _id: expect.any(String),
                firstName: 'Test',
                lastName: 'Author',
            }),
        });
    });

    it('/authors/:id (PATCH)', async () => {

        const res = await request(getApp().getHttpServer())
            .patch(`/authors/${authorId}`)
            .send({ firstName: 'Updated Test' })
            .expect(200);

        expect(res.body).toEqual({
            success: true,
            message: 'Author updated successfully',
            
        });
    });

    it('/authors/:id (DELETE)', async () => {
        const res = await request(getApp().getHttpServer())
            .delete(`/authors/${authorId}`)
            .expect(200);

        expect(res.body).toEqual({
            success: true,
            message: 'Author deleted successfully',
        });
    });
});
