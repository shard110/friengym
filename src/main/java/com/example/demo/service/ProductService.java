package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ProductDetailDTO;
import com.example.demo.dto.ProductListDTO;
import com.example.demo.dto.ProductResponseDTO;
import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.CategoryRepository; // 카테고리 레포지토리 추가

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository; // 카테고리 레포지토리 추가

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // 모든 상품 가져오기
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    // 상품 ID로 가져오기
    public Product getProductById(int pNum) {
        Optional<Product> product = productRepository.findById(pNum);
        if (product.isPresent()) {
            return product.get();
        } else {
            throw new RuntimeException("Product not found with id: " + pNum);
        }
    }

    // 상품 저장 또는 업데이트
    public Product saveOrUpdateProduct(Product product) {
        // 업데이트 전 pcate 값 로그 출력
        System.out.println("Before update: pcate = " + product.getPcate());

        // pcate 값 체크
        if (product.getPcate() == null) {
            throw new IllegalArgumentException("pcate cannot be null");
        }

        // 카테고리 존재 여부 체크
        if (!categoryRepository.existsById(product.getPcate())) {
            throw new IllegalArgumentException("Invalid pcate: " + product.getPcate());
        }

        return productRepository.save(product);
    }

    // 상품 삭제
    public void deleteProduct(int pNum) {
        productRepository.deleteById(pNum);
    }

    // 인기상품 가져오기 
    public List<Product> findPopularProducts(Integer limit) {
        String sql =  "SELECT p.pNum, p.pName, p.pPrice, p.pCount, p.pImg, p.pDate, p.pIntro, SUM(d.docount) AS total_quantity " +
                 "FROM product p " +
                 "JOIN Dorder d ON p.pNum = d.pnum " +
                 "JOIN ordertbl o ON d.onum = o.onum " +
                 "GROUP BY p.pNum, p.pName, p.pPrice, p.pCount, p.pImg, p.pDate, p.pIntro " +
                 "ORDER BY total_quantity DESC ";
        if (limit != null) {
                sql += "LIMIT " + limit;
            }

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Product product = new Product();
            product.setpNum(rs.getInt("pNum"));
            product.setpName(rs.getString("pName"));
            product.setpPrice(rs.getInt("pPrice"));
            product.setpCount(rs.getInt("pCount"));
            product.setpImg(rs.getString("pImg"));
            product.setpDate(rs.getDate("pDate"));
            product.setpIntro(rs.getString("pIntro"));
            return product;
        });
    }

    // 최근 4개의 상품 가져오기 (최신순)
    public List<Product> findRecentProducts(int limit) {
        String sql = "SELECT * FROM product ORDER BY pDate DESC LIMIT ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Product product = new Product();
            product.setpNum(rs.getInt("pNum"));
            product.setpName(rs.getString("pName"));
            product.setpPrice(rs.getInt("pPrice"));
            product.setpCount(rs.getInt("pCount"));
            product.setpImg(rs.getString("pImg"));
            product.setpDate(rs.getDate("pDate"));
            product.setpIntro(rs.getString("pIntro"));
            return product;
        }, limit);
    }

    // 지난 한 달 동안의 상품 가져오기    
    public List<Product> findProductsFromLastMonth() {
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        String sql = "SELECT * FROM product WHERE pDate >= ? ORDER BY pDate DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Product product = new Product();
            product.setpNum(rs.getInt("pNum"));
            product.setpName(rs.getString("pName"));
            product.setpPrice(rs.getInt("pPrice"));
            product.setpCount(rs.getInt("pCount"));
            product.setpImg(rs.getString("pImg"));
            product.setpDate(rs.getDate("pDate"));
            product.setpIntro(rs.getString("pIntro"));
            return product;
        }, java.sql.Date.valueOf(oneMonthAgo));
    }

    // 카테고리별 상품을 ProductResponseDTO로 반환
    public List<ProductResponseDTO> findProductsByCategory(int catenum) {
        List<Product> products = productRepository.findByCategory(catenum);
        return products.stream()
                       .map(ProductResponseDTO::new)
                       .collect(Collectors.toList());
    }

    // 검색
    public List<ProductListDTO> searchProducts(String keyword) {
        List<Product> products = productRepository.findByPNameContaining(keyword);
        return products.stream()
                .map(product -> new ProductListDTO(
                        product.getpNum(),
                        product.getpName(),
                        product.getpPrice(),
                        product.getpImgUrl(),
                        product.getpCount()
                ))
                .collect(Collectors.toList());
    }

    public List<ProductListDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> new ProductListDTO(
                        product.getpNum(),
                        product.getpName(),
                        product.getpPrice(),
                        product.getpImgUrl(),
                        product.getpCount()
                ))
                .collect(Collectors.toList());
    }

    public ProductDetailDTO getProductDetail(int pNum) {
        Product product = productRepository.findById(pNum).orElseThrow(() -> new RuntimeException("Product not found"));
        return new ProductDetailDTO(
                product.getpNum(),
                product.getpName(),
                product.getpPrice(),
                product.getpImgUrl(),
                product.getpCount(),
                product.getpDate(),
                product.getpDetailImgUrl()
        );
    }
}
