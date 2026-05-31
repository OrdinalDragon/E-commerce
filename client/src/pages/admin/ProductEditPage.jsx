import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from '../../features/api/productApi.js';
import ImageDropzone from '../../components/admin/ImageDropzone.jsx';
import toast from 'react-hot-toast';

const ProductEditPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: productData, isLoading: loadingProduct } = useGetProductDetailsQuery(id, { skip: !isEdit });
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && productData?.data) {
      const p = productData.data;
      setForm({
        name: p.name || '',
        description: p.description || '',
        price: p.price?.toString() || '',
        category: p.category || '',
        stock: p.stock?.toString() || '',
      });
      setImages(p.images || []);
    }
  }, [isEdit, productData]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio';
    if (!form.description.trim()) errs.description = 'La descripción es obligatoria';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = 'Ingresa un precio válido mayor a 0';
    if (!form.category.trim()) errs.category = 'La categoría es obligatoria';
    if (form.stock === '' || isNaN(Number(form.stock)) || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock)))
      errs.stock = 'Ingresa un número entero válido (0 o más)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
      images,
    };

    try {
      if (isEdit) {
        await updateProduct({ id, ...payload }).unwrap();
        toast.success('Producto actualizado correctamente');
      } else {
        await createProduct(payload).unwrap();
        toast.success('Producto creado correctamente');
      }
      navigate('/admin/products');
    } catch (err) {
      const msg = err?.data?.message || 'Error al guardar el producto';
      toast.error(msg);
    }
  };

  const isSaving = creating || updating;

  if (isEdit && loadingProduct) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
      errors[field]
        ? 'border-anger/60 focus:ring-anger/30'
        : 'border-gray-200 focus:border-sadness focus:ring-sadness/30'
    }`;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar producto' : 'Nuevo producto'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? 'Modifica los datos del producto existente' : 'Completa los datos para crear un nuevo producto'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del producto</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej. Auriculares Bluetooth Pro"
            className={inputClass('name')}
          />
          {errors.name && <p className="text-xs text-anger mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe las características del producto..."
            className={inputClass('description')}
          />
          {errors.description && <p className="text-xs text-anger mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio ($)</label>
            <input
              type="number"
              name="price"
              step="0.01"
              min="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              className={inputClass('price')}
            />
            {errors.price && <p className="text-xs text-anger mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Ej. Electrónica"
              className={inputClass('category')}
            />
            {errors.category && <p className="text-xs text-anger mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
            <input
              type="number"
              name="stock"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              className={inputClass('stock')}
            />
            {errors.stock && <p className="text-xs text-anger mt-1">{errors.stock}</p>}
          </div>
        </div>

        <ImageDropzone images={images} onImagesChange={setImages} />

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-sadness to-fear text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {isSaving ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {isEdit ? 'Guardando...' : 'Creando...'}
              </>
            ) : (
              isEdit ? 'Guardar cambios' : 'Crear producto'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditPage;
