function drinkAll(callback1, callback2, flavour, snack) {
  if (flavour === 'rose' && snack === 'chips') {
    callback1();
    callback2();
  }else if(flavour === 'rose'){
    callback1();
  }else if(snack === 'chips'){  
    callback2();
 }
}

describe('drinkAll', () => {
  it('drinks something lemon-flavoured', () => {
    const drink = jest.fn();
    const eat = jest.fn();
    drinkAll(drink, eat,'rose', 'chips');
    expect(drink).toHaveBeenCalled();
    expect(eat).toHaveBeenCalled();
  });

  it('does not drink something octopus-flavoured', () => {
    const drink = jest.fn();
    const eat = jest.fn();
    drinkAll(eat, drink, 'rose', 'pizza');
    expect(drink).not.toHaveBeenCalled();
    expect(eat).not.toHaveBeenCalled();
  });
});