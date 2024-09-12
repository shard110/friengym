package com.example.demo.controller;

import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.dto.ProductListDTO;
import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Product uploadImage(@PathVariable("pNum") int pNum, @RequestParam("file") MultipartFile file) throws IOException {
        Product product = productService.getProductById(pNum);
        if (product == null) {
            throw new RuntimeException("Product not found with id: " + pNum);
        }

        // 파일 시스템에 이미지 저장
        String fileName = file.getOriginalFilename();
        String filePath = "path/to/save/images/" + fileName;
        File dest = new File(filePath);
        file.transferTo(dest);

        // 이미지 URL 설정
        product.setpImgUrl("/images/" + fileName);
        return productService.saveOrUpdateProduct(product);
    }

    @PostMapping("/{pNum}/uploadDetailImage")
    public Product uploadDetailImage(@PathVariable("pNum") int pNum, @RequestParam("file") MultipartFile file) throws IOException {
        Product product = productService.getProductById(pNum);
        if (product == null) {
            throw new RuntimeException("Product not found with id: " + pNum);
        }

        // 파일 시스템에 상세 이미지 저장
        String fileName = file.getOriginalFilename();
        String filePath = "path/to/save/images/" + fileName;
        File dest = new File(filePath);
        file.transferTo(dest);

        // 상세 이미지 URL 설정
        product.setpDetailImgUrl("/images/" + fileName);
        return productService.saveOrUpdateProduct(product);
    }

    // 검색
    @GetMapping("/search")
    public List<ProductListDTO> searchProducts(@RequestParam String keyword) {
        return productService.searchProducts(keyword);
    }
}
