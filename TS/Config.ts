/**
 * Created by clovis on 27/08/17.
 */
class Config
{
    public static AirDensity : number = 0.3;

    public static PlayerLife : number = 3;
    public static PlayerFireTime : number = 500;
    public static PlayerSpeed : number = 10;


    public static FireDamage : number = 0.01;

    public static TileSize : number = 32;

    public static ObstacleProbability : number = 30; //%
    public static ObstacleLength : number = 3;

    public static Tiles = {
        "Ground" : 0,
        "Wall" : 1,
        "WallH" : 2,
        "WallV" : 3,

        "Weed" : 12,
        "Rock" : 13,

        "Lava" : 25,
        "LavaTR" : 15,
        "LavaT" : 16,
        "LavaR" : 17,
        "LavaTL" : 18,
        "LavaBR" : 19,
        "LavaBL" : 20,
        "LavaB" : 21,
        "LavaL" : 22,

        "Water" : 26,
        "WaterTR" : 4,
        "WaterT" : 5,
        "WaterR" : 6,
        "WaterTL" : 7,
        "WaterBR" : 8,
        "WaterBL" : 9,
        "WaterB" : 10,
        "WaterL" : 11
    };

    public static TilesWalkable(tile : number)
    {
        switch(tile) {
            default:
                return false;
            case Config.Tiles.Ground:
            case Config.Tiles.Lava:
            case Config.Tiles.Water:
                return true;
        }
    }
}