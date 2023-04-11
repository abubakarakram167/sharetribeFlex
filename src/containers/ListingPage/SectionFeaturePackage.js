import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.module.css';

const SectionFeaturesMaybe = props => {
  const { options, publicData } = props;
  if (!publicData) {
    return null;
  }

  console.log("the public data", publicData)

  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id="ListingPage.featuresTitle" />
      </h2>
      {
        publicData && publicData.packages.map((packageData => {
          return (
            <div>
              <div>{packageData.name}</div>
              <div>{packageData.quantity}</div>
              <div>{packageData.unit}</div>
              <div>{packageData.price}</div>
              <div>{packageData.total}</div>
            </div>
          )
        }))
      }
    </div>
  );
};

export default SectionFeaturesMaybe;
