class UserProfile {
    constructor( name, age,ph_no,addr,cuisine) {
        this.name = name;
        this.age = age;
        this.ph_no = ph_no;
        this.addr=addr;
        this.cuisine = cuisine;
    }
}

module.exports.UserProfile = UserProfile;
