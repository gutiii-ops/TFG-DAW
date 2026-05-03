import React from 'react'

const CategoryTabs = ({ categories, activeCategory, onChange }) => {
  return (
    <div className='category-tabs'>
      {categories.map((category) => (
        <button
          key={category.id}
          type='button'
          className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
          onClick={() => onChange(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs
