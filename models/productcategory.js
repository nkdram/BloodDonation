

module.exports = function(sequelize, DataTypes) {

    var ProductCategory = sequelize.define('ProductCategory', {
            category: DataTypes.TEXT,
            averageprice: DataTypes.TEXT,
            stores: DataTypes.TEXT
        },
        {
            classMethods:{
                tableName: 'vw_groupedProductsByCategory'
            }
        }
    );

    return ProductCategory;
};