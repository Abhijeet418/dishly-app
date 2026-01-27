package com.project.dishly.repository;

import com.project.dishly.model.ShoppingList;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ShoppingList entity operations.
 * Provides database access methods for shopping list queries.
 */
@Repository
public interface ShoppingListRepository extends MongoRepository<ShoppingList, String> {
    
    /**
     * Find all shopping lists belonging to a specific user.
     *
     * @param userId the user ID
     * @return list of shopping lists
     */
    List<ShoppingList> findByUserId(String userId);
}
