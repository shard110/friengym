package com.example.demo.service;

import com.example.demo.dto.CartItemDTO;
import com.example.demo.dto.ProductDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.entity.Cart;
import com.example.demo.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    public List<CartItemDTO> getCartItems(String userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        return cartItems.stream()
                .map(cart -> new CartItemDTO(
                        cart.getCnum(),
                        cart.getcCount(),
                        new ProductDTO(
                                cart.getProduct().getpNum(),
                                cart.getProduct().getpName(),
                                cart.getProduct().getpPrice(),
                                cart.getProduct().getpImgUrl()
                        ),
                        new UserDTO(cart.getUser().getId()) // UserDTO 생성자 사용
                ))
                .collect(Collectors.toList());
    }

    public Cart addOrUpdateCartItem(Cart cart) {
        Optional<Cart> existingCartItem = cartRepository.findByUserIdAndProductPNum(cart.getUser().getId(), cart.getProduct().getpNum());
        if (existingCartItem.isPresent()) {
            Cart existingCart = existingCartItem.get();
            existingCart.setcCount(existingCart.getcCount() + cart.getcCount());
            return cartRepository.save(existingCart);
        } else {
            return cartRepository.save(cart);
        }
    }

    public Cart getCartItemById(int cnum) {
        return cartRepository.findById(cnum).orElseThrow(() -> new RuntimeException("Cart item not found"));
    }

    public void removeCartItem(int cnum) {
        cartRepository.deleteById(cnum);
    }

    public void clearCart(String userId) {
        cartRepository.deleteByUserId(userId);
    }
}
