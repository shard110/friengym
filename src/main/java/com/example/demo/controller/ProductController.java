package com.example.demo.controller;

import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.dto.ProductListDTO;
import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping
    public List<ProductListDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{pNum}")
    public ProductDetailDTO getProductDetail(@PathVariable int pNum) {
        return productService.getProductDetail(pNum);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveOrUpdateProduct(product);
    }

    @PutMapping("/{pNum}")
    public Product updateProduct(@PathVariable("pNum") int pNum, @RequestBody Product product) {
        product.setpNum(pNum);
        return productService.saveOrUpdateProduct(product);
    }

    @DeleteMapping("/{pNum}")
    public void deleteProduct(@PathVariable("pNum") int pNum) {
        productService.deleteProduct(pNum);
    }

    @PostMapping("/{pNum}/uploadImage")
    public ResponseEntity<Product> uploadImage(@PathVariable("pNum") int pNum, @RequestParam("file") MultipartFile file) throws IOException {
        Product product = productService.getProductById(pNum);
        if (product == null) {
            throw new RuntimeException("Product not found with id: " + pNum);
        }

        String directoryPath = new File("src/main/resources/static/images").getAbsolutePath();
        File dir = new File(directoryPath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(dir, fileName);
        file.transferTo(dest);

        product.setpImgUrl("/images/" + fileName + "?t=" + System.currentTimeMillis());
        productService.saveOrUpdateProduct(product);

        return ResponseEntity.ok(product);
    }

    @PostMapping("/{pNum}/uploadDetailImage")
    public ResponseEntity<Product> uploadDetailImage(@PathVariable("pNum") int pNum, @RequestParam("file") MultipartFile file) throws IOException {
        Product product = productService.getProductById(pNum);
        if (product == null) {
            throw new RuntimeException("상품을 찾을 수 없습니다: " + pNum);
        }

        String directoryPath = new File("src/main/resources/static/images").getAbsolutePath();
        File dir = new File(directoryPath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(dir, fileName);
        file.transferTo(dest);

        product.setpDetailImgUrl("/images/" + fileName + "?t=" + System.currentTimeMillis());
        productService.saveOrUpdateProduct(product);

        return ResponseEntity.ok(product);
    }

    @GetMapping("/search")
    public List<ProductListDTO> searchProducts(@RequestParam String keyword) {
        return productService.searchProducts(keyword);
    }
}
