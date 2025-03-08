export default {
  'POST /api/v1/file/upload': (req: any, res: any) => {
    res.json({
      msg: 'success',
      data: 'http://localhost:8000/upload/custom_h5ad/66dcfede19f0493d2a9001b8.h5ad',
      code: 0,
    });
  },
};
