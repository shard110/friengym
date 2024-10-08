package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.OrderDTO;
import com.example.demo.dto.ProductDTO;
import com.example.demo.dto.DorderDTO;
import com.example.demo.entity.Ordertbl;
import com.example.demo.entity.Product;
import com.example.demo.repository.OrderRepository;
import com.example.demo.entity.Dorder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    // 모든 주문을 가져오는 메서드
    public List<OrderDTO> getAllOrders() {
        List<Ordertbl> orders = orderRepository.findAll(); // 모든 주문을 조회
        return orders.stream().map(this::convertToDTO).collect(Collectors.toList()); // DTO로 변환하여 반환
    }

    public List<OrderDTO> getOrdersByUserId(String id) {
        List<Ordertbl> orders = orderRepository.findById(id);
        return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private OrderDTO convertToDTO(Ordertbl order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setOnum(order.getOnum());
        orderDTO.setPaymentId(order.getPaymentId());
        orderDTO.setStatus(order.getStatus());
        orderDTO.setOdate(order.getOdate());
        orderDTO.setId(order.getId());
        orderDTO.setDorders(order.getDorders().stream().map(this::convertToDTO).collect(Collectors.toList()));
        return orderDTO;
    }

    private DorderDTO convertToDTO(Dorder dorder) {
        DorderDTO dorderDTO = new DorderDTO();
        dorderDTO.setDoNum(dorder.getDoNum());
        dorderDTO.setDoCount(dorder.getDoCount());
        dorderDTO.setDoPrice(dorder.getDoPrice());
        dorderDTO.setProduct(convertToDTO(dorder.getProduct()));
        return dorderDTO;
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setpNum(product.getpNum());
        productDTO.setpName(product.getpName());
        productDTO.setpPrice(product.getpPrice());
        productDTO.setpImgUrl(product.getpImgUrl());
        return productDTO;
    }
}
