import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ensureListing } from '../../util/data';
import { EditListingFeaturesForm } from '../../forms';
import PackageTable from '../Table/PackageTable/PackageTable';
import MainPackageTable from '../Table/MainPackageTable/table';
import { ListingLink } from '../../components';
import Button from '../../components/Button/Button';
import css from './EditListingFeaturesPanel.module.css';

const EditListingFeaturesPanel = props => {
  const {
    rootClassName,
    className,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const [view, setView] = useState('main');
  const [currentSelectedPackage, setCurrentSelectedPackage] = useState(null);
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const { publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingFeaturesPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingFeaturesPanel.createListingTitle" />
  );

  const packages = publicData && publicData.packages ? publicData.packages : [];

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      {view === 'main' ? ( //initial view to show all packages.
        <>
          <Button
            onClick={() => {
              setView('Secondary');
              setCurrentSelectedPackage(null);
            }}
            type="primary"
            className={css.packageButton}
          >
            Create Package
          </Button>
          <MainPackageTable
            data={
              publicData && publicData.packages
                ? publicData.packages.filter(packageData => !packageData.isService)
                : []
            }
            onEdit={value => {
              setCurrentSelectedPackage(value);
              setView('Secondary');
            }}
            allPackagesData={publicData.packages ? publicData.packages : []}
          />
        </>
      ) : (
        <PackageTable
          packages={packages ? packages : []}
          onBack={() => setView('main')}
          parentKey={currentSelectedPackage}
          onSave={values => {
            var ids = new Set(packages.map(d => d.key));
            var merged = [...packages, ...values.filter(d => !ids.has(d.key))]; // Merging all packages to display to main table and save .
            const updatedValues = {
              publicData: { packages: merged.length > 0 ? merged : [] },
            };
            onSubmit(updatedValues);
          }}
        />
      )}

      {/* <EditListingFeaturesForm
        className={css.form}
        name={FEATURES_NAME}
        initialValues={initialValues}
        onSubmit={values => {
          const { amenities = [] } = values;

          const updatedValues = {
            publicData: { amenities, packages: currentPackages },                                       // Hiding it and show the table display to show packages;
          };
          onSubmit(updatedValues);
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
      /> */}
    </div>
  );
};

EditListingFeaturesPanel.defaultProps = {
  rootClassName: null,
  className: null,
  listing: null,
};

const { bool, func, object, string } = PropTypes;

EditListingFeaturesPanel.propTypes = {
  rootClassName: string,
  className: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingFeaturesPanel;
