import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });

  const addProduct = async (productId: number) => {
    try {

      const stock = await api.get('stock/' + productId)
        .then(response => response.data.amount);

      var itemInCart = cart.find(item => item.id === productId);
      var quantityInCart = !!itemInCart ? itemInCart.amount : 0;

      if (quantityInCart >= stock) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if (!!itemInCart) {
        setCart(
          cart.map((product : Product) => product.id === productId ? { ...product, amount: product.amount + 1 } : product)
        )
      } else {
        const newProduct = await api.get('products/' + productId)
          .then(response => response.data);
        newProduct.amount = 1;
        setCart([...cart, newProduct]);
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  useEffect(() => {
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
  }, [cart]);

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
