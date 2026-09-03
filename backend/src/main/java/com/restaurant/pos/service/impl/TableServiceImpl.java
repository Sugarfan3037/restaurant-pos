	package com.restaurant.pos.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.pos.dto.OrderDTO;
import com.restaurant.pos.dto.OrderItemDTO;
import com.restaurant.pos.dto.TableDTO;
import com.restaurant.pos.entity.Employee;
import com.restaurant.pos.entity.Order;
import com.restaurant.pos.entity.OrderItem;
import com.restaurant.pos.entity.RestaurantTable;
import com.restaurant.pos.enums.OrderStatus;
import com.restaurant.pos.enums.TableStatus;
import com.restaurant.pos.exception.BusinessException;
import com.restaurant.pos.exception.ResourceNotFoundException;
import com.restaurant.pos.repository.EmployeeRepository;
import com.restaurant.pos.repository.OrderRepository;
import com.restaurant.pos.repository.RestaurantTableRepository;
import com.restaurant.pos.service.TableService;


@Service
public class TableServiceImpl implements TableService{
private final RestaurantTableRepository tableRepository;
private final EmployeeRepository employeeRepository;
private final OrderRepository orderRepository;

public TableServiceImpl(
RestaurantTableRepository tableRepository,
EmployeeRepository employeeRepository,
OrderRepository orderRepository) {

this.tableRepository = tableRepository;
this.employeeRepository = employeeRepository;
this.orderRepository = orderRepository;
    }
	@Override
	public List<TableDTO> findAll() {
		return tableRepository.findAll().stream().map(this::toTableDTO).toList();
	}

	@Override
	@Transactional
	public OrderDTO openTable(Integer tableNumber, Long employeeId) {
		RestaurantTable table=tableRepository.findByTableNumber(tableNumber)
				              .orElseThrow(
				            	()->new ResourceNotFoundException(
				            			"找不到桌號:"+tableNumber	
				            			)	  	
				            		  );
		Employee employee=employeeRepository.findById(employeeId)
				          .orElseThrow(
				        		()->new ResourceNotFoundException(
					            	    "找不到員工,id="+employeeId	
					            		)	  	
				        		  );
		if(table.getStatus()==TableStatus.OCCUPIED) {
			throw new BusinessException(
					tableNumber+"號桌目前使用中，無法再次開桌"	
					);
		}
		Boolean hasOpenOrder=orderRepository.findByRestaurantTableIdAndStatus(
				table.getId(),OrderStatus.OPEN
				).isPresent();
		if(hasOpenOrder) {
			throw new BusinessException(
					tableNumber+"號桌已經存在未結帳訂單"	
					);
		}
		Order order=new Order();
		order.setRestaurantTable(table);
		order.setEmployee(employee);
		order.setStatus(OrderStatus.OPEN);
		order.setTotalAmount(BigDecimal.ZERO);
		order.setCreatedAt(LocalDateTime.now());
		order.setUpdatedAt(LocalDateTime.now());
		
		Order saveOrder=orderRepository.save(order);
		table.setStatus(TableStatus.OCCUPIED);
		tableRepository.save(table);
		return toOrderDTO(saveOrder);
	}

	@Override
	@Transactional(readOnly = true)
	public OrderDTO findCurrentOrder(Integer tableNumber) {
		RestaurantTable table=tableRepository.findByTableNumber(tableNumber)
				              .orElseThrow(
				            	()->new ResourceNotFoundException(
				            			"找不到桌號:"+tableNumber
				            			)  
				            		  );
		Order order=orderRepository.findByRestaurantTableIdAndStatus(
				    table.getId(),OrderStatus.OPEN).orElseThrow(
				    		()->new ResourceNotFoundException(
			            			tableNumber+"號桌目前沒有未結帳訂單"
			            			)  
				    		);
		return toOrderDTO(order);
	}
private TableDTO toTableDTO(
RestaurantTable table) {

	return new TableDTO(
	        table.getId(),
	        table.getTableNumber(),
	        table.getCapacity(),
	        table.getStatus()
	        );
	    }
private OrderDTO toOrderDTO(Order order) {
	List<OrderItemDTO> items =
            order.getItems()
                 .stream()
                 .map(item -> new OrderItemDTO(
                     item.getId(),
                     item.getMenuItem().getId(),
                     item.getMenuItem().getName(),
                     item.getQuantity(),
                     item.getUnitPrice(),
                     item.getSubtotal(),
                     item.getSugarLevel(),
                     item.getIceLevel(),
                     item.getNote()
                 ))
                 .toList();

    return new OrderDTO(
        order.getId(),
        order.getRestaurantTable().getTableNumber(),
        order.getEmployee().getId(),
        order.getEmployee().getName(),
        order.getStatus(),
        order.getTotalAmount(),
        order.getCreatedAt(),
        items
    );
}
private void recalculateTotal(Order order) {
BigDecimal total=order.getItems().stream().map(OrderItem::getSubtotal)
                 .reduce(BigDecimal.ZERO,BigDecimal::add);
order.setTotalAmount(total);
}
@Override
@Transactional
public OrderDTO changeTable(Integer sourceTableNumber, Integer targetTableNumber) {
	if(sourceTableNumber.equals(targetTableNumber)) {
		throw new BusinessException("來源桌與目的桌不可相同");	
	}
	RestaurantTable sourceTable=tableRepository.findByTableNumber(sourceTableNumber)
			                    .orElseThrow(()->new ResourceNotFoundException(
			                    "找不到來源桌號:"+sourceTableNumber));
	RestaurantTable targetTable=tableRepository.findByTableNumber(targetTableNumber)
                                .orElseThrow(()->new ResourceNotFoundException(
                                "找不到目的桌號:"+targetTableNumber));
	Order order=orderRepository.findByRestaurantTableIdAndStatus(
			    sourceTable.getId(),OrderStatus.OPEN).orElseThrow(
			    ()->new BusinessException(sourceTableNumber+"號桌目前沒有未結帳訂單，無法換桌"));
	if(targetTable.getStatus()==TableStatus.OCCUPIED) {
		throw new BusinessException(targetTableNumber+"號桌目前使用中，無法換桌");
	}
	boolean targetHasOpenOrder=orderRepository.findByRestaurantTableIdAndStatus(
			                   targetTable.getId(),OrderStatus.OPEN).isPresent();
	if(targetHasOpenOrder) {
		throw new BusinessException(targetTableNumber+"號桌已經存在未結帳訂單");
	}
	order.setRestaurantTable(targetTable);
	sourceTable.setStatus(TableStatus.AVAILABLE);
    targetTable.setStatus(TableStatus.OCCUPIED);
    return toOrderDTO(order);
}
@Override
@Transactional
public OrderDTO mergeTable(Integer sourceTableNumber, Integer targetTableNumber) {
	if(sourceTableNumber.equals(targetTableNumber)) {
		throw new BusinessException("來源桌與目的桌不可相同");
	}
	RestaurantTable sourceTable=tableRepository.findByTableNumber(sourceTableNumber)
			                    .orElseThrow(()->new ResourceNotFoundException(
			                    "找不到來源桌號:"+sourceTableNumber));
	RestaurantTable targetTable=tableRepository.findByTableNumber(targetTableNumber)
                                .orElseThrow(()->new ResourceNotFoundException(
                                "找不到目的桌號:"+targetTableNumber));
	Order sourceOrder=orderRepository.findByRestaurantTableIdAndStatus(
			          sourceTable.getId(),OrderStatus.OPEN).orElseThrow(
			          ()->new BusinessException(sourceTableNumber+"號桌目前沒有未結帳訂單，無法併桌"));
	Optional<Order> targetOrderOptional=orderRepository.findByRestaurantTableIdAndStatus(
			                            targetTable.getId(), OrderStatus.OPEN);
	if(targetOrderOptional.isEmpty()) {
		sourceOrder.setRestaurantTable(targetTable);
		sourceTable.setStatus(TableStatus.AVAILABLE);
		targetTable.setStatus(TableStatus.OCCUPIED);
		return toOrderDTO(sourceOrder);
	}
	Order targetOrder=targetOrderOptional.get();
	List<OrderItem> sourceItems=new ArrayList<>(sourceOrder.getItems());
	   for(OrderItem item:sourceItems) {
		   sourceOrder.getItems().remove(item);
		   targetOrder.getItems().add(item);
		   item.setOrder(targetOrder);
	   }
	recalculateTotal(targetOrder);
	sourceOrder.setStatus(OrderStatus.CANCELLED);
	sourceOrder.setTotalAmount(BigDecimal.ZERO);
	sourceTable.setStatus(TableStatus.AVAILABLE);
	targetTable.setStatus(TableStatus.OCCUPIED);
	
	return toOrderDTO(targetOrder);
}
    
}
