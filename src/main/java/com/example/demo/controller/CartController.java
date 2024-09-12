package com.example.demo.controller;

import com.example.demo.entity.Cart;
import com.example.demo.entity.User;
import com.example.demo.service.CartService;
import com.example.demo.config.JwtTokenProvider;
import com.example.demo.dto.CartItemDTO;
import com.example.demo.dto.ProductDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping("/{userId}")
    public List<CartItemDTO> getCartItems(@PathVariable String userId, @RequestHeader("Authorization") String token) {
        if (jwtTokenProvider.validateToken(token)) {
            return cartService.getCartItems(userId);
        } else {
            throw new RuntimeException("Invalid token");
        }
    }

    @PostMapping
    public CartItemDTO addOrUpdateCartItem(@RequestBody Cart cart, @RequestHeader("Authorization") String token) {
        String userId = jwtTokenProvider.getClaims(token).getSubject();
        if (jwtTokenProvider.validateToken(token)) {
            User user = new User();
            user.setId(userId);
            cart.setUser(user);
            Cart updatedCart = cartService.addOrUpdateCartItem(cart);
            return new CartItemDTO(
                    updatedCart.getCnum(),
                    updatedCart.getcCount(),
                    new ProductDTO(
                            updatedCart.getProduct().getpNum(),
                            updatedCart.getProduct().getpName(),
                            updatedCart.getProduct().getpPrice(),
                            updatedCart.getProduct().getpImgUrl()
                    )
            );
        } else {
            throw new RuntimeException("Invalid token");
        }
    }

    @PutMapping("/{cnum}")
    public CartItemDTO updateCartItemCount(@PathVariable int cnum, @RequestBody Cart cart, @RequestHeader("Authorization") String token) {
        String userId = jwtTokenProvider.getClaims(token).getSubject();
        if (jwtTokenProvider.validateToken(token)) {
            Cart existingCartItem = cartService.getCartItemById(cnum);
            if (existingCartItem != null && existingCartItem.getUser().getId().equals(userId)) {
                existingCartItem.setcCount(cart.getcCount());
                Cart updatedCart = cartService.addOrUpdateCartItem(existingCartItem);
                return new CartItemDTO(
                        updatedCart.getCnum(),
                        updatedCart.getcCount(),
                        new ProductDTO(
                                updatedCart.getProduct().getpNum(),
                                updatedCart.getProduct().getpName(),
                                updatedCart.getProduct().getpPrice(),
                                updatedCart.getProduct().getpImgUrl()
                        )
                );
            } else {
                throw new RuntimeException("Invalid cart item or user");
            }
        } else {
            throw new RuntimeException("Invalid token");
        }
    }

    @DeleteMapping("/{cnum}")
    public void removeCartItem(@PathVariable int cnum, @RequestHeader("Authorization") String token) {
        String userId = jwtTokenProvider.getClaims(token).getSubject();
        if (jwtTokenProvider.validateToken(token)) {
            cartService.removeCartItem(cnum);
        } else {
            throw new RuntimeException("Invalid token");
        }
    }
}
