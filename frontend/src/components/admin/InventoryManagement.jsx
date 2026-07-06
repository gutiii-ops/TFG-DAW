import React, { useState, useEffect, useContext } from 'react';
import { SubViewHeader } from './SubViewHeader';
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct } from '../../api/adminService';
import { NotificationContext } from '../../context/NotificationContext';
import ConfirmationModal from '../dashboard/ConfirmationModal';
import '../../styles/components/admin.css';
import '../../styles/components/dashboard/CoachManagement.css';

const CATEGORY_OPTIONS = [
  { id: 1, label: 'Ropa' },
  { id: 2, label: 'Suplementos' },
  { id: 3, label: 'Equipamiento' },
  { id: 4, label: 'Accesorios' }
];

const EMPTY_PRODUCT = {
  name: '',
  description: '',
  category: 1,
  price: '',
  imageUrl: ''
};

export const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useContext(NotificationContext);

  // Estados para modales
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PRODUCT);

  // Estado confirmación borrado
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, productId: null, productName: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAdminProducts();
      setProducts(data);
    } catch (error) {
      addNotification('Error al cargar inventario', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(EMPTY_PRODUCT);
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.product_name || '',
      description: prod.product_description || '',
      category: Number(prod.product_category) || 1,
      price: prod.product_price || '',
      imageUrl: prod.product_image_url || ''
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateAdminProduct(editingProduct.product_id, formData);
        addNotification('Producto actualizado correctamente', 'success');
      } else {
        await createAdminProduct(formData);
        addNotification('Producto añadido al inventario', 'success');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      addNotification(err.message || 'Error al guardar producto', 'error');
    }
  };

  const handleDeleteClick = (prod) => {
    setDeleteConfirm({
      isOpen: true,
      productId: prod.product_id,
      productName: prod.product_name
    });
  };

  const executeDelete = async () => {
    try {
      await deleteAdminProduct(deleteConfirm.productId);
      addNotification('Producto eliminado del catálogo', 'success');
      fetchProducts();
    } catch (err) {
      addNotification(err.message || 'Error al eliminar', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, productId: null, productName: '' });
    }
  };

  const getCategoryLabel = (catId) => {
    const cat = CATEGORY_OPTIONS.find(c => c.id === Number(catId));
    return cat ? cat.label : 'General';
  };

  return (
    <div className="admin-section-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <SubViewHeader title="Inventario de Tienda" />
        <button 
          onClick={handleOpenCreate} 
          className="admin-search-btn" 
          style={{ height: 'fit-content' }}
        >
          + Añadir Producto
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="table-loader">Cargando inventario...</div>
        ) : products.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Miniatura</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.product_id}>
                  <td>
                    {prod.product_image_url ? (
                      <img 
                        src={prod.product_image_url} 
                        alt={prod.product_name} 
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40?text=📦'; }}
                      />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: 'var(--bg2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>📦</div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{prod.product_name}</div>
                    {prod.product_description && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                        {prod.product_description}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="permission-tag" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--border)' }}>
                      {getCategoryLabel(prod.product_category)}
                    </span>
                  </td>
                  <td style={{ fontWeight: 'bold', color: 'var(--y)' }}>{Number(prod.product_price).toFixed(2)}€</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleOpenEdit(prod)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(prod)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3>Catálogo Vacío</h3>
            <p>No hay productos cargados en la tienda. Empieza añadiendo tu primer producto arriba.</p>
          </div>
        )}
      </div>

      {/* Modal Formulario de Producto */}
      {modalOpen && (
        <div className="session-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="session-modal-panel" onClick={e => e.stopPropagation()}>
            <div className="session-modal-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form className="session-form" onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>Nombre del Producto *</label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="Ej: Camiseta Técnica Gym"
                  />
                </div>
                
                <div className="form-field">
                  <label>Categoría *</label>
                  <select name="category" value={formData.category} onChange={handleChange} required>
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Precio (€) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    required 
                    placeholder="0.00"
                    min="0"
                  />
                </div>

                <div className="form-field full-width">
                  <label>URL de la Imagen</label>
                  <input 
                    name="imageUrl" 
                    value={formData.imageUrl} 
                    onChange={handleChange} 
                    placeholder="https://enlace-de-la-imagen.com/foto.jpg"
                  />
                </div>

                <div className="form-field full-width">
                  <label>Descripción</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows={3} 
                    placeholder="Añade una descripción detallada para la ficha de la tienda..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="form-btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" className="form-btn-save">
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        title="Eliminar Producto"
        message={`¿Estás seguro de que quieres eliminar "${deleteConfirm.productName}" permanentemente? Desaparecerá del catálogo de la tienda.`}
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, productId: null, productName: '' })}
        confirmText="Eliminar Producto"
      />
    </div>
  );
};
