package com.example.demo.api;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ProductResponseDTO;
import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;

@RestController
@RequestMapping(value = "/product")
public class ProductHomeController {

    @Autowired
    private ProductService productService;

    @GetMapping(value = "/home")
    public ResponseEntity<List<Product>> homePage() {
        List<Product> products = productService.findAllProducts();
        return ResponseEntity.ok()
                             .contentType(new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8))
                             .body(products);
    }

    @GetMapping("/popular")
public ResponseEntity<List<Product>> getPopularProducts(@RequestParam(value = "limit", required = false) Integer limit) {
    List<Product> products = productService.findPopularProducts(limit);
    if (products.isEmpty()) {
        System.out.println("No popular products found");
    }
    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(products);
}


// /product - 최근 4개의 신상품 가져오기
@GetMapping
public ResponseEntity<List<Product>> getRecentProducts() {
    List<Product> products = productService.findRecentProducts(4);
    return ResponseEntity.ok()
                         .contentType(new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8))
                         .body(products);
}

// /products/new - 최근 한 달 이내에 등록된 상품 가져오기
@GetMapping("/new")
public ResponseEntity<List<Product>> getNewProducts() {
    List<Product> products = productService.findProductsFromLastMonth();
    return ResponseEntity.ok()
                         .contentType(new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8))
                         .body(products);
}



@GetMapping("/category/{catenum}")
public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(@PathVariable (value = "catenum") int catenum) {
    List<ProductResponseDTO> productDTOs = productService.findProductsByCategory(catenum);
    if (productDTOs.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(productDTOs);
}

}